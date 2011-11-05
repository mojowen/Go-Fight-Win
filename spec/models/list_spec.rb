require 'spec_helper'

describe List do
  
  before :each do
    @list = Factory(:list)
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
  
  it 'using the rows method with sort will return rows sorted by grandparent field in correct order' do
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
    vals = ['a','z','Z','y','9','a','00','3','23','AA','d','a','00','3','23','AA','d']
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
    @grandchild.rows(:sort => @sortable.name).each do |r|
      r[@sortable.name].should.equal? vals[x]
      x += 1
    end
  end
  

end
