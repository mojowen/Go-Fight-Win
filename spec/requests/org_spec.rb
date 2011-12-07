require 'spec_helper'

describe 'An orgs routes and permissions' do
  before :each do
    @org = Factory(:org)
    @org.save
    @user = login_user(@org)
  end
  
  
  it 'user in org can visit an org and it\'s path and assigns org' do
    visit org_path(@org.to_param)
    page.should have_content(@org.name)
  end
    
  it 'user in org can visit an org discrete and it\'s path and assigns org' do
    visit org_discrete_path(@org.id)
    page.should have_content(@org.name)
  end

  it 'user is listed on orgs that it is a member are listed on show page' do
    visit org_discrete_path(@org.id)
    page.should have_content(@user.email+' (that\'s you)')
  end
  
  it 'users visits org thath have access and sees other users' do
    @other_user = Factory(:user)
    @other_user.memberships.new(:org_id => @org.id, :approved => true ).save
    visit org_discrete_path(@org.id)
    page.should have_content(@other_user.email)
  end
  
  
  it 'unauthenticated user redirected to root when visiting org' do
    sign_out_by_hand
    get org_discrete_path(@org.id)
    response.should redirect_to '/'
  end
  
  it 'unauthenticated user warned they do not have acccess when visiting org' do
    sign_out_by_hand
    visit org_discrete_path(@org.id)
    page.should have_content('You don\'t have access to that Org')
  end
  
  it 'users can access org\'s children of org' do
    @child = Factory(:org, :parent_id => @org.id)
    @child.save
    visit org_path(@child.to_param)
    page.should have_content(@child.name)
  end
  
  it 'user cannot manage an org if they are not an admin' do 
    ability = Ability.new(@user)
    ability.should_not be_able_to(:manage, @org)
  end
  
  it 'admin user can manage an org' do
    membership = @user.memberships.first
    membership.admin = true
    membership.save
    ability = Ability.new(@user)
    ability.should be_able_to(:manage, @org)
  end
  
  it 'admin users can manage all children orgs' do
    membership = @user.memberships.first
    membership.admin = true
    membership.save
    @child = Factory(:org, :parent_id => @org.id)
    ability = Ability.new(@user)
    ability.should be_able_to(:manage, @child)
  end
  
  it 'user visits an org and sees lists' do
    lists = []
    3.times do
      lists.push(Factory(:list, :org => @org));
    end
    visit org_path(@org.to_param)
    lists.each do |l|
      page.should have_content(l.name)
    end
  end
end