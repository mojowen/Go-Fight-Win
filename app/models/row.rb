class Row
  
  # This function is called by RSPEC, just resets class-wide variables which are used to limit SQL calls
  def self.clean
    @@fields = nil
    @@list = nil
    @@list_parents = nil
  end
  
  def initialize(attrs)
    # This hash holds all of the variables
    @row = {}

    unless attrs.class.name == 'Hash'
      assign_key(attrs)
    else
      @tempkey ||= attrs[:_tempkey]
      @item ||= attrs[:item]
      @list ||= attrs[:list]
      @@fields ||= attrs[:fields]
      assign_key( attrs[:item]  || attrs[:item_id] || attrs[:key] || attrs[:list]  )
    end
    
    # Seeting global variables which saves on reloading the list and the lists fields
    @@list ||= @list
    @@list_parents ||= @list.parents
    @@fields ||= @list.fields(@@list_parents)
    
    if @@list != @list
      # Resets class variables if the list has changed
      @@list = @list
      @@list_parents = @list.parents
      @@fields = @list.fields(@@list_parents)
    end
    
    @fields = @@fields
    @parents = @item.parents
    @entries = @item.entries(@parents)
    
    @changed_fields = []

    #Creates an function for each field and then stores any entry data and intializing values as part of that field
    @fields.each do |f|
      #Initalizing the new methods for each field
      field_name = new_var f.name, nil, f.id
      f[:field_name] = field_name
      # Populates the Row with entry data
      entry = @entries.select{ |entry| entry.field_id == f.id }.first
      @row[field_name] = entry.data unless entry.nil?
      
      # If no other variables were passed with the initializing, ignores this
      if attrs.class.name == 'Hash'
        # Only fills in new values if the fields value was passed when initializing AND it's different then the exsiting data
        if ( !attrs[field_name].nil? || !attrs[field_name.to_s.gsub('_',' ')].nil? ) && attrs[field_name] != @row[field_name]
          @row[field_name] = attrs[field_name] || attrs[field_name.to_s.gsub('_',' ')] 
          # Taking note of the changed fields, this will be used when saving
          @changed_fields.push( {:field => f, :new_value => @row[field_name]} )
        end
      end
    end
  end
  
  def save
    # not sure if this is right, but should be able to add blank fields right? I dunno
    
    success = true
    errors = []
    if @item.new_record? || !@changed_fields.empty?
      @@list_parents.count.times do |i|
        @parents[i] ||= Item.new(:list_id => @@list_parents[i] )
      end
      @parents.reverse.each do |item|
          item.parent = @parents[@parents.index(item)+1] unless @parents[@parents.index(item)+1].nil?
          save = item.save
          success = success & save
          errors.push( {:message => 'Couldn\'t save to '+item.list_id.to_s+' #list'} ) if !save
      end
    end
    @changed_fields.each do |f|
      the_item = @parents.select{ |i| i.list_id == f[:field].list_id }.first
      data = f[:new_value].strip.empty? ? nil : f[:new_value]
      unless data.nil?
        save = Entry.new( :item => the_item, :field => f[:field], :data => data ).save
      else
        Entry.find_by_item_id_and_field_id_and_active(the_item.id, f[:field].id, true).delete
        save = true
      end
      success = success & save
      errors.push( {:field => f[:field].name, :value => f[:new_value], :message => 'DB Error on saving'} ) if !save
    end
    ready = { :key => @item.id, :success => success, :list => self['list'], :error => errors }
    # Will need to return the _tempkey if the tempkey was passed to it
    ready[:_tempkey] = @tempkey unless @tempkey.nil?
    return ready
  end
  

  ## Helper methods

  # This method is responsible for creating new accessible objects for the object
  def new_var(name, init = nil, key = nil)
    # Will make sure not to duplicate methods or values
    key ||= 0
    safe_name = name.gsub(' ','_')
    while @row.include?(safe_name.to_sym) do
      safe_name = name+'_'+key.to_s
      key += 1
    end
    @row[safe_name.to_sym] = init.nil? ? '' : init
    create_method(safe_name.to_sym) { @row[safe_name.to_sym] }
    return safe_name.to_sym
  end
  
  # Method to assign list and item
 def assign_key(attrs)
   case attrs.class.name
   when 'Fixnum'
     new_var 'key', attrs
     @item ||= Item.find(attrs)
   when 'Item'
     @item ||= attrs
     new_var 'key', @item.id
   when 'List'
     @list ||= attrs
     @item ||= @list.items.new
   end    
   @list ||= @item.list
   new_var 'list', @list.name
   new_var 'created_at', @item.created_at
   new_var 'updated_at', @item.updated_at
 end

  def create_method(name, &block)
    self.class.send(:define_method, name, &block)
  end

  def as_json(options={})
    return @row.prep
  end

  def to_s
    return 'Row('+@row.to_s+')'
  end

  def [](iv)
      if  iv.class.name == 'Fixnum' 
        send @fields.select{|f| f.id == iv }.first[:field_name]
      else 
        send iv.gsub(' ','_')
      end
  end

 
end