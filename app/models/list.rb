class List < ActiveRecord::Base
  belongs_to :org
  belongs_to :parent, :class_name => "List", :foreign_key => 'parent_id'
  
  # Name and find paramters and scope
  before_validation :fix_name
  before_create :copy_parent
  validates_uniqueness_of :name, :scope => :org_id  
  validates_presence_of :name
  before_save :re_json
  serialize :operators
  
  def to_param
    self.name.downcase.gsub(' ','_')
  end
  def self.find_by_org_and_slug(org_id, slug, args = {})
    self.find_by_org_id_and_name(org_id, slug.gsub('_',' ').split(' ').map {|w| w.capitalize }.join(' '), args)
  end

  def fix_name
    self.name = self.name.split(' ').map {|w| w.capitalize }.join(' ') unless self.name.nil?
  end
  def copy_parent
    if !self.parent_id.nil? && self.operators.nil?
      self.operators = self.parent.operators
    end
  end
  def has_children
    children = List.find_all_by_parent_id(self.id)
    return children.empty? ? false : children
  end
  
    
  # Defining fields here to include all fields that are related to this list or any other lists
  def parents
    parent = self.parent
    parents = [self.id]
    @@list = self
    until parent.nil? do
      parents.push(parent.id)
      parent = parent.parent
    end
    return parents
  end
  
  def fields(loaded_parents = nil)
    parents = loaded_parents.nil? ? self.parents : loaded_parents
    fields = Field.where('fields.list_id IN(?) AND fields.active =?', parents, true)
    fields.each{ |f| f[:plural] = f.name.pluralize }.reverse
    fields.instance_eval do
      def new(args ={} )
        args[:list] = @@list
        return Field.new(args)
      end
    end
    fields.push( Field.new(:name => 'children', :field_type => 'children' ) ) if self.has_children
    return fields
  end
  
  #Relationship to item and entry
  # TO DO: Add some sort of paging function or something to both of these or something
  has_many :items, :conditions => ['items.active = ?', true] 
  
  
  def rows( args = {} )
    rows = []
    # preload parents, we'll need this anyway
    parents = self.parents
    # preload fields, we'll need this anyway
    @fields = self.fields(parents)
    
    offset = args[:page] || 0
    limit = args[:limit] || 5000
    # limit = 1000 if limit > 1000
    
    # Figures out how extended a family member this is
    ancestory = parents.count
    
    # Function to create the includes table
    stuffer = [:entries]
    ancestory.times do
      stuff = [ :entries, :parent => stuffer ]
      stuffer = stuff
    end
    stuffer = ancestory > 0 ? stuffer : [:entries, :parent]
    
    items = Item.where('items.list_id = ?',self.id).includes(stuffer)
    items.each do |item|
      rows.push( Row.new( {:item => item, :list => self, :fields => fields } ) )
    end
    
    
    if args[:filter]
      conditions = []
      if args[:filter].class.name == 'Array'
        conditions = args[:filter].map{ |s| make_filter(s) }
      else
        conditions[0] = make_filter( args[:filter] )
      end
      rows = rows.select{ |r| eval( conditions.join('&&') ) }
    end
    
    #Checks if there is a sort argument
    if args[:sort]
      conditions = []
      if args[:sort].class.name == 'Array'
        conditions = args[:sort].map{ |s| make_sort(s) }
      else
        conditions[0] = make_sort( args[:sort] )
      end
      rows = rows.sort!{ |x,y| eval( '['+conditions.map{|s| s[:left] }.join(',')+']' ) <=> eval( '['+conditions.map{|s| s[:right] }.join(',')+']' )  }
    end
    
    # TO DO: - group by one or two field values
    
    size = rows.length
    rows = rows.slice(offset,limit)
    
    rows.instance_eval do
      def new(args ={} )
        args[:list] = @@list
        return Row.new(args)
      end
    end
    
    return {:rows => rows, :size => size}
  end
  
  
  def make_sort(sort)
    sorts ={}
    # If there is, checks to see if it's a hash or just a field name
    if sort.class.name == 'Hash'
      field = find_field(sort[:field])
      # If no direction, assume assending
      direction = sort[:direction].nil? ? 'ASC' : sort[:direction]
    else
      field = find_field(sort)
      direction = 'ASC'
    end
    if direction == 'DESC'
      sorts[:left] = 'y['+field.to_s+']'
      sorts[:right] = 'x['+field.to_s+']'
    else 
      sorts[:left] = 'x['+field.to_s+']'
      sorts[:right] = 'y['+field.to_s+']'
    end
    return sorts
  end
  
  def make_filter(filter)
    condition = ''
    if filter.class.name == 'Hash'
      field = find_field(filter[:field])
      condition ||= filter[:condition]
      operator = make_operator(filter[:operator],condition)
    else
      filter = filter.gsub(/"(.*?)"/) { |s| s.gsub(' ','_')}.split(' ')
      field = find_field(filter.shift)
      condition = filter.pop.gsub('_',' ').gsub('"','')
      condition = '' if condition == 'empty' && filter[0] == 'is' || condition == 'blank' && filter[0] == 'is'
      operator = make_operator(filter.join(' '), condition)
    end
    # Will probably want to do something here when redoing field types, right now evaluating every condition as a string (should translate, when valid, into a date or fixnum)
    return 'r['+field.to_s+'] '+operator+' "'+condition+'"'
  end
  
  def find_field(field)
    case field.class.name
    when 'Fixnum'
      return field
    when 'Field'
      return field.id
    else
      return field.to_i if /^[-+]?[0-9]+$/ === field
      if field.index('_')
        last = field.split('_').last
        return last.to_i if /^[-+]?[0-9]+$/ === last && @fields.select{ |f| f.id == last.to_i }.count == 1
      end
      field = field.gsub('_',' ')
      find_by_name = @fields.select{ |f| f.name == field }
      return find_by_name.first.id
    end
  end
  
  def make_operator(operator,condition = nil)

    operator = operator.gsub(' to','')
    
    return '==' if operator == '=='
    return '==' if operator == 'equal'
    return '==' if operator == 'equals'
    return '==' if operator == 'is'
    return '==' if operator == '='
    
    return '.starts_with?("'+condition+'") && "'+condition+'" ==' if operator == 'starts with' || operator == 'begins with'
    return '.reverse.starts_with?("'+condition.reverse+'") && "'+condition+'" ==' if operator == 'ends with'
    
    return '.index("'+condition+'") != nil && "'+condition+'" ==' if operator == 'includes' || operator == 'contains'|| operator == 'has'
    return '.index("'+condition+'") == nil && "'+condition+'" ==' if operator == 'does not includes' || operator == 'does not contains'|| operator == 'does not have'
    
    return '!=' if operator == '!='
    return '!=' if operator == 'isn\'t'
    return '!=' if operator == '<>'
    return '!=' if operator == 'not'
    return '!=' if operator == 'is not'
    return '!=' if operator == 'not equal'

    return '>' if operator == '>'
    return '>' if operator == 'greater than'
    return '>' if operator == 'more than'
    return '>' if operator == 'bigger than'
    return '>' if operator == 'after'

    return '<' if operator == '<'
    return '<' if operator == 'before'
    return '<' if operator == 'less than'
    return '<' if operator == 'smaller than'
    return '<' if operator == 'fewer than'

    return '>=' if operator == '>='
    return '>=' if operator == 'greater than or equal'
    return '>=' if operator == 'more than or equal'
    return '>=' if operator == 'bigger than or equal'
    return '>=' if operator == 'after or equal'

    return '<=' if operator == '<='
    return '<=' if operator == 'before or equal'
    return '<=' if operator == 'less than or equal'
    return '<=' if operator == 'smaller than or equal'
    return '<=' if operator == 'fewer than or equal'
        
  end
  
  ## Views
  has_many :views, :conditions => ['views.active = ?', true] 
  

end