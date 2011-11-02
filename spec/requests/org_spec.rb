require 'spec_helper'

describe 'An orgs routes and permissions' do
  before :each do
    @org = Factory(:org)
  end

  it 'can visit an org at it\'s path is success' do
    get org_path(@org.to_param)
    response.should be_success
  end
  
  it 'can visit an org and it\'s path and assigns org' do
    visit org_path(@org.to_param)
    page.should have_content(@org.name)
  end
  
  it 'can visit an org discrete at it\'s path is success' do
    get org_discrete_path(@org.id)
    response.should be_success
  end
  
  it 'can visit an org discrete and it\'s path and assigns org' do
    visit org_discrete_path(@org.id)
    page.should have_content(@org.name)
  end
end