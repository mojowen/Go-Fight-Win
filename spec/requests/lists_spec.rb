require 'spec_helper'

describe "Lists" do
  
  before :each do 
    @org = Factory(:org)
    @org.save
    @list = Factory(:list, :org_id => @org.id )
    @list.save
    @user = login_user(@org)
  end

  it 'user a list and sees the name of the list' do
    visit list_path(@org.to_param, @list.to_param)
    page.should have_content(@list.name)
  end

end
