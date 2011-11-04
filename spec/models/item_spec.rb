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

  
end
