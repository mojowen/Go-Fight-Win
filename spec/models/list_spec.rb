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
  
  # test "List grabs items that are :active => true" do
  #   assert_not_equal @list.items.count, Item.find_all_by_list_id(@list.id).count, "Grabbed only active items"
  # end
  
  # test "List grabs fields that are :active => true" do
  #   assert_not_equal @list.fields.count, Field.find_all_by_list_id(@list.id).count, "Grabbed only active fields"
  #   @field = nil
  # end
end
