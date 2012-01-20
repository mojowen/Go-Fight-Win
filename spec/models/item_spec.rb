require 'spec_helper'

describe Item do
  before :each do
    @item = Factory(:item)
  end
  
  it 'belongs to a list' do
    @item.list.class.should.equal? List
  end
  
  it 'has parents' do
    @child = @item.list.items.new(:parent => @item)
    @child.save
    @child.parent.should.equal? @item
  end
  
  it 'item grabs entries that are active, and ignores those that are innactive' do 
    @item.save
    3.times do
      Factory(:entry, :item => @item)
    end
    Entry.last.update_attributes(:active => false)
    Item.find(@item).entries.include?(Entry.last).should be_false
  end
  
  it 'all_entries returns all of an item and all of its parents entries' do
    @child = Factory(:item, :parent => @item)
    @grandchild = Factory(:item, :parent => @child)
    3.times do
      Factory(:entry, :item => @item)
      Factory(:entry, :item => @child)
      Factory(:entry, :item => @grandchild)
    end
    @grandchild.entries.count.should.should.equal? 9
  end
  
  it 'can create new Entry through entries method' do
    @entry = @item.entries.new(:field_id => 1, :data => 'hello')
    @entry.save.should be_true
  end
  it 'can grab child items when needed and matches correctly if not in the same org' do
    @child = Factory(:item, :parent => @item)
    @child.save
    @item.grab_children( [ @child.list]  ).should == [{:name=> @child.list.org.name , :address=> '/'+@child.list.org.to_param+'/'+@child.list.to_param }]
  end
  
end
