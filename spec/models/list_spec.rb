require 'spec_helper'

describe List do
  
  before :each do
    @list = Factory(:list)
    @list.save
  end
  
  it "Lists have to have a name" do
    @list[:name] = nil
    @list.save.should be_false
  end
  
  it "New list defaults to active" do
    list = List.new
    list[:active].should be_true
  end
  
  it 'New list needs to have unique names within an org' do
    @list.save
    @dif_list = @list.org.lists.new
    @dif_list.name = @list.name
    @dif_list.save.should be_false
  end
  
  it 'lists has a parent through other orgs' do
    @child = Factory(:list, :parent_id => @list)
    @child.parent.should.equal? @list
  end
  
  it 'list grabs fields that are active, and ignores those that are innactive' do 
    @list.save
    3.times do
      Factory(:field, :list => @list)
    end
    Field.last.update_attributes(:active => false)
    List.find(@list).fields.include?(Field.last).should be_false
  end
  
  it 'returns all of parents fields using all lists' do
    @child = Factory(:list, :parent => @list)
    @grandchild = Factory(:list, :parent => @child)
    3.times do
      Factory(:field, :list => @list)
      Factory(:field, :list => @child)
      Factory(:field, :list => @grandchild)
    end
    @grandchild.fields.count.should.equal? 9
  end
  
  it 'returns all of parents fields in the order the desc order were created using all list' do
    @child = Factory(:list, :parent => @list)
    @grandchild = Factory(:list, :parent => @child)
    fields = []
    3.times do
      fields.push(Factory(:field, :list => @list))
      fields.push(Factory(:field, :list => @child))
      fields.push(Factory(:field, :list => @grandchild))
    end
    @grandchild.fields.should.equal? fields
  end
  
  it 'list grabs items that are active, and ignores those that are innactive' do 
    @list.save
    3.times do
      Factory(:item, :list => @list)
    end
    Item.last.update_attributes(:active => false)
    List.find(@list).items.include?(Item.last).should be_false
  end
  
  it 'can create new Field through fields method' do
    @field = @list.fields.new(:name => 'hello')
    @field.save.should be_true
  end


  it 'creates an array of rows off of every item' do
    5.times do
      Factory(:item, :list => @list)
    end
    @list.rows.count.should.equal? 5
  end
  
  it 'will return a limited number if limit is set' do
    5.times do
      Row.new(@list).save
    end
    @list.rows(:limit => 1).count.equal? 1
  end

  it 'will return an offset number if offset is set' do
    5.times do
      Row.new(@list).save
    end
    @list.rows(:offset => 1)[0].key.should.equal? @list.items[2].id
  end

  it 'list can return rows and every returned row has the fields represented' do
    fields = []
    3.times do
      fields.push(Factory(:field, :list => @list))
    end
    5.times do
      Factory(:item, :list => @list)
    end
    @list.rows.each do |r|
      fields.each do |f|
        r[f.name].nil?.should be_false
      end
    end
  end

  it 'list can return rows and every returned row has the fields AND PARENT field represented in the row objects' do
    @child = Factory(:list, :parent => @list)
    fields = []
    3.times do
      fields.push(Factory(:field, :list => @list))
      fields.push(Factory(:field, :list => @child))
    end
    5.times do
      Factory(:item, :list => @child)
    end
    @child.rows.each do |r|
      fields.each do |f|
        r[f.name].nil?.should be_false
      end
    end
  end
  
  it 'using the rows method can return an array of rows that includes entry data from child and parent' do
    @child = Factory(:list, :parent => @list)
    fields = []
    items = []
    5.times do
      fields.push(Factory(:field, :list => @child ))
      fields.push(Factory(:field, :list => @list ))
      items.push(Factory(:item, :list => @list))
      items.push(Factory(:item, :list=> @child, :parent => items.last) )
    end
    fields.each do |f|
      items.each do |i|
        Factory(:entry, :item => i, :field => f).save
      end
    end
    
    @child.rows.each do |r|
      fields.each do |f|
        r[f.name].should.equal? Entry.find_by_field_id_and_item_id(f.id, r.key).data
      end
    end
  end
  
  it 'using the rows method with sort will return rows sorted by own field in correct order' do
    @child = Factory(:list, :parent => @list)
    fields = []
    items = []
    5.times do
      fields.push(Factory(:field, :list => @child ))
      fields.push(Factory(:field, :list => @list ))
      items.push(Factory(:item, :list => @list))
      items.push(Factory(:item, :list=> @child, :parent => items.last) )
    end
    @sortable = Factory(:field, :list => @child )
    vals = ['a','z','Z','y','9','a','00','3','23','AA','d']
    x = 0
    items.each do |i|
      fields.each do |f|
        Factory(:entry, :item => i, :field => f).save
      end
      Factory(:entry, :item => i, :field => @sortable, :data => vals[x] )
      x+=1
    end
    vals = vals.sort {|x,y| x.upcase <=> y.upcase }
    x = 0
    @child.rows(:sort => @sortable.name).each do |r|
      r[@sortable.name].should.equal? vals[x]
      x += 1
    end
  end
  
  it 'using the rows method with sort will return rows sorted by parent field in correct order' do
    @child = Factory(:list, :parent => @list)
    fields = []
    items = []
    5.times do
      fields.push(Factory(:field, :list => @child ))
      fields.push(Factory(:field, :list => @list ))
      items.push(Factory(:item, :list => @list))
      items.push(Factory(:item, :list=> @child, :parent => items.last) )
    end
    @sortable = Factory(:field, :list => @list )
    vals = ['a','z','Z','y','9','a','00','3','23','AA','d']
    x = 0
    items.each do |i|
      fields.each do |f|
        Factory(:entry, :item => i, :field => f).save
      end
      Factory(:entry, :item => i, :field => @sortable, :data => vals[x] )
      x+=1
    end
    vals = vals.sort {|x,y| x.upcase <=> y.upcase }
    x = 0
    @child.rows(:sort => @sortable.name).each do |r|
      r[@sortable.name].should.equal? vals[x]
      x += 1
    end
  end
  
  describe 'using the rows method with sort on a grandparents field' do
    before :each do
      @child = Factory(:list, :parent => @list)
      @grandchild = Factory(:list, :parent => @child )
      fields = []
      items = []
      5.times do
        fields.push(Factory(:field, :list => @child ))
        fields.push(Factory(:field, :list => @list ))
        items.push(Factory(:item, :list => @list))
        items.push(Factory(:item, :list=> @child, :parent => items.last) )
        items.push(Factory(:item, :list=> @grandchild, :parent => items.last) )
      end
      @sortable = Factory(:field, :list => @list )
      @vals = ['a','z','Z','y','9','a','00','3','23','AA','d','a','00','3','23','AA','d']
      x = 0
      items.each do |i|
        fields.each do |f|
          Factory(:entry, :item => i, :field => f).save
        end
        Factory(:entry, :item => i, :field => @sortable, :data => @vals[x] )
        x+=1
      end
      @vals = @vals.sort {|x,y| x.upcase <=> y.upcase }
    end
    it 'will return rows sorted by grandparents with nil at the end when sorted acs' do
      x = 0
      @row_save = Row.new(:list => @grandchild).save
      @grandchild.rows(:sort => {:field => @sortable.name, :direction => 'ASC'} ).first.key.should == @row_save[:key]
    end
    it 'will return rows sorted by grandparents with nil at the end when sorted desc' do
      x = 0
      @row_save = Row.new(:list => @grandchild).save
      @grandchild.rows(:sort => {:field => @sortable.name, :direction => 'DESC'} ).last.key.should == @row_save[:key]
    end
    it 'will return a limited number if limit is set' do
      @grandchild.rows(:sort => {:field => @sortable.name, :direction => 'DESC'} , :limit => 1).count.equal? 1
    end
    it 'will return the correct row if a limit is set' do
      @grandchild.rows(:sort => {:field => @sortable.name, :direction => 'DESC'} , :limit => 1).first[@sortable.name].equal? @vals.last
    end
    it 'will offset when a sort is performed' do
      @grandchild.rows(:sort => {:field => @sortable.name, :direction => 'DESC'}, :offset => 1).first[@sortable.name].equal? @vals[@vals.length - 1]
    end
    it 'will return correct rows when multi sort is performed' do
      Row.new(:list => @grandchild, Field.first.name => 'aa', Field.last.name => 'zz').save
      @row = Row.new(:list => @grandchild, Field.first.name => 'aa', Field.last.name => 'aa').save
      @grandchild.rows(:sort => [Field.first.id, Field.last.to_param ] ).first.key.should == @row[:key]
    end
  end

  describe 'the row :filter functionality' do
    before :each do
      @list = Factory(:list)
      5.times do
        Factory(:field, :list => @list)
      end
    end
    it 'filters rows based on equal criteria' do 
      Row.new(:list => @list, Field.first.name => 'filtered').save
      @row = Row.new(:list => @list, Field.first.name => 'preserved').save
      @list.rows(:filter => Field.first.to_param+' is preserved' ).first.key.should == @row[:key]
    end
    it 'filters rows based on nested equal criteria' do 
      Row.new(:list => @list, Field.first.name => 'filtered').save
      Row.new(:list => @list, Field.first.name => 'preserved', Field.last.name => 'filtered').save
      @row = Row.new(:list => @list, Field.first.name => 'preserved').save
      @list.rows(:filter => [Field.first.to_param+' is preserved', Field.last.to_param+' is not filtered'] ).first.key.should == @row[:key]
    end
    it 'filters based on not empty' do
      Row.new(:list => @list).save
      @row = Row.new(:list => @list, Field.first.name => 'preserved').save
      @list.rows(:filter => [Field.first.to_param+' is not empty'] ).first.key.should == @row[:key]
    end
    it 'filters based on empty' do
      Row.new(:list => @list, Field.first.name => 'stuff here').save
      @row = Row.new(:list => @list).save
      @list.rows(:filter => [Field.first.to_param+' is empty'] ).first.key.should == @row[:key]
    end
    it 'filters based on parent field' do
      @child = Factory(:list, :parent => @list )
      Row.new(:list => @child, Field.first.name => 'stuff here').save
      @row = Row.new(:list => @child, Field.first.name => 'want').save
      @child.rows(:filter => [Field.first.to_param+' is want'] ).first.key.should == @row[:key]
    end
    it 'filters based on starts with' do
      Row.new(:list => @list, Field.first.name => 'and here').save
      @row = Row.new(:list => @list, Field.first.name => 'stuff here').save
      @list.rows(:filter => [Field.first.to_param+' starts with stuff'] ).first.key.should == @row[:key]
    end
    it 'filters based on ends with field' do
      Row.new(:list => @list, Field.first.name => 'stuff bear').save
      @row = Row.new(:list => @list, Field.first.name => 'stuff here').save
      @list.rows(:filter => [Field.first.to_param+' ends with here'] ).first.key.should == @row[:key]
    end
    it 'filters based on greater than' do
      Row.new(:list => @list, Field.first.name => 'a').save
      @row = Row.new(:list => @list, Field.first.name => 'd').save
      @list.rows(:filter => [Field.first.to_param+' greater than a'] ).first.key.should == @row[:key]
    end
    it 'filters based on less than' do
      Row.new(:list => @list, Field.first.name => 'd').save
      @row = Row.new(:list => @list, Field.first.name => 'a').save
      @list.rows(:filter => [Field.first.to_param+' less than d'] ).first.key.should == @row[:key]
    end
    it 'filters based on greater than or equal to' do
      Row.new(:list => @list, Field.first.name => 'a').save
      @row = Row.new(:list => @list, Field.first.name => 'c').save
      @list.rows(:filter => [Field.first.to_param+' greater than or equal to c'] ).first.key.should == @row[:key]
    end
    it 'filters based on less than or equal to' do
      Row.new(:list => @list, Field.first.name => 'd').save
      @row = Row.new(:list => @list, Field.first.name => 'b').save
      @list.rows(:filter => [Field.first.to_param+' less than or equal to b'] ).first.key.should == @row[:key]
    end
    it 'filters with a limit' do
      Row.new(:list => @list).save
      @row = Row.new(:list => @list, Field.first.name => 'a').save
      Row.new(:list => @list, Field.first.name => 'a').save
      @list.rows(:filter => [Field.first.to_param+' == a'], :limit => 1).last.key.should == @row[:key]
    end
    it 'filters with a limit and an offset' do
      Row.new(:list => @list).save
      Row.new(:list => @list, Field.first.name => 'a').save
      @row = Row.new(:list => @list, Field.first.name => 'a').save
      @list.rows(:filter => [Field.first.to_param+' is a'], :limit => 1, :page => 1 ).first.key.should == @row[:key]
    end
    it 'filters work fine with spaces as longs as they are in quotes' do
      Row.new(:list => @list, Field.first.name => 'farting is bad').save
      @row = Row.new(:list => @list, Field.first.name => 'farting is good').save
      @list.rows(:filter => [Field.first.to_param+' is "farting is good"']).first.key.should == @row[:key]
    end
  end
  
  describe 'List has many views' do
    it 'has many views' do
      @view = @list.views.new(:name => 'a view')
      @view.save.should be_true
    end
  end

end
