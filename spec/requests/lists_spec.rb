require 'spec_helper'

describe "Lists" do
  
  before :each do 
    @org = Factory(:org)
    @list = Factory(:list, :org_id => @org.id )
  end
  describe 'visiting a list as a user' do
    before :each do
      @user = login_user(@org)
    end
    it 'user a list and sees the name of the list' do
      visit list_path(@org.to_param, @list.to_param)
      page.should have_content(@list.name)
    end
  end
      
end
