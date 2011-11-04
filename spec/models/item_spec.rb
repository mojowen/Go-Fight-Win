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
  
end
