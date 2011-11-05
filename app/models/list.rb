class List < ActiveRecord::Base
  belongs_to :org
  belongs_to :parent, :class_name => "List", :foreign_key => 'parent_id'
  
  
  
  # Name and find paramters and scope
  before_validation :fix_name
  validates_uniqueness_of :name, :scope => :org_id  
  validates_presence_of :name
  
  def to_param
    self.name.downcase.gsub(' ','_')
  end  
  def self.find_by_org_and_slug(org_id, slug, args = {})
    self.find_by_org_id_and_name(org_id, slug.gsub('_',' ').split(' ').map {|w| w.capitalize }.join(' '), args)
  end

  def fix_name
    self.name = self.name.split(' ').map {|w| w.capitalize }.join(' ') unless self.name.nil?
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
    fields.instance_eval do
      def new(args ={} )
        args[:list] = @@list
        return Field.new(args)
      end
    end
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
    fields = self.fields(parents)
    # If no arguments, just load as normal
    if args.empty?
      lookup = self.items
    else
      #Checks if there is a sort argument
      if args[:sort]
        # If there is, checks to see if it's a hash or just a field name
        if args[:sort].class.name == 'Hash'
          # If it is a hash, check the sorting field, if it is a number assign that otherwise gotta look it up in the already loaded fields
          field = args[:sort][:field].class.name == 'Fixnum' ? args[:sort][:field] : fields.select{|f| f.name == args[:sort][:field]}.first.id
          # If no direction, assume assending
          direction = args[:sort][:direction].nil? ? 'ASC' : args[:sort][:direction]
        else
          field = args[:sort].class.name == 'Fixnum' ? args[:sort] : fields.select{|f| f.name == args[:sort]}.first.id
          direction = 'ASC'
        end
        # Figures out how extended a family member this is
        ancestory = parents.index( fields.select{|f| f.id == field}.first.list_id )
        unless ancestory == 0
          
          # Function to create the join table
          stuffer = :children
          ancestory - 1.times do
            stuff = { :children => stuffer}
            stuffer = stuff
          end
          suffix = ancestory > 1 ? '_'+ancestory.to_s : ''
          stuffer = ancestory > 1 ? stuffer : :children
          
          # Lookup function when the criteria is nested
          lookup = Item.joins( stuffer ).where('children_items'+suffix+'.list_id =?',self.id).joins(:entries).where('entries.field_id =?',field).order('upper(entries.data) '+direction)
        else
          # Lookup when not nested
          lookup = Item.where('items.list_id =?',self.id).joins(:entries).where('entries.field_id =?',field).order('upper(entries.data) '+direction)
        end
        # TO DO: - sort by more than just one field
        # Some ideas about multi sort (sorta) http://archives.postgresql.org/pgsql-sql/1998-09/msg00119.php will need to learn more sql. very tired now
        # TO DO: - filter by one or many conditions and fields
        # TO DO: - group by one or two field values
      end
    end
    
    lookup.each do |item|
      rows.push( Row.new( {:item => item, :list => self, :fields => fields } ) )
    end
    
    # Reverse the rows as push will add them out of order
    return rows.reverse
  end
end