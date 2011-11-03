require 'spec_helper'

describe 'Admin managing memberships of org' do
  before :each do
     @org = Factory(:org)
     @admin = login_admin(@org)
     @membership = Factory(:membership, :org => @org )
     visit org_path(@org.to_param)
   end
   
  it 'Admin removes user from org will successfully remove them from the org' do
    click_link 'remove?'
    page.should have_content('removed '+@membership.user.email+' from '+@org.name)
  end
  it 'Adds a member as an admin and user is notified of success' do
    click_link 'make admin?'
    page.should have_content(@membership.user.email+'\'s now an admin for '+@org.name)
  end
  it 'Adds a member as an admin that user\'s membership is saved as admin' do
    click_link 'make admin?'
    Membership.find(@membership.id).admin.should be_true
  end
  it 'Removes an member\'s admin access and notifieds user its been removed' do
    @membership.admin = true
    @membership.save
    visit org_path(@org.to_param)
    click_link 'remove admin?'
    page.should have_content(@membership.user.email+'\'s no longer an admin for '+@org.name)    
  end
  it 'Removes an admin and admin privelages are gone from membership' do
    @membership.admin = true
    @membership.save
    visit org_path(@org.to_param)
    click_link 'remove admin?'
    Membership.find(@membership.id).admin.should be_false
  end
  it 'Can see pending invites for an org' do
    @pending = Membership.new(:org_id => @org.id, :approved => true )
    @pending.save
    visit org_path(@org.to_param)
    page.should have_content(@pending.invite_token)
  end
end

describe 'User activating membership from an invite' do
  before :each do 
    @org = Factory(:org)
    @membership = @org.memberships.new(:approved => true)
    @membership.save
  end
  
  it 'Authenticated user an invite link and is taken to that org' do
    @different_org = Factory(:org)
    login_user(@different_org)
    visit invite_membership_path(@org.id, @membership.invite_token)
    current_path.should == org_path(@org.to_param)
  end
  
  it 'Invite takes unauthenticated user to login screen' do
    visit invite_membership_path(@org.id, @membership.invite_token)
    current_path.should == new_user_registration_path
  end
  
  it 'Non-user acccepts invite and logs into using invitation and can access org' do
    visit invite_membership_path(@org.id, @membership.invite_token)
    current_path.should == new_user_registration_path
    fill_in "user_email", :with => 'an@email.com'
    fill_in "user_password", :with => 'sososecret'
    fill_in "user_password_confirmation", :with => 'sososecret'
    click_button 'Sign up'
    visit org_path(@org.to_param)
    current_path.should == org_path(@org.to_param)
  end
  
  it 'Non-user acccepts invite and creates new account through authenticate and can access org' do
    visit invite_membership_path(@org.id, @membership.invite_token)
    current_path.should == new_user_registration_path
    login_with_oauth
    fill_in "user_email", :with => 'bull@shit.com'
    click_button 'Sign up'
    visit org_path(@org.to_param)
    current_path.should == org_path(@org.to_param)
  end
  
  it 'User cannot accept invitation if already part of an org' do
    login_user(@org)
    visit invite_membership_path(@org.id, @membership.invite_token)
    page.should have_content('something went wrong')
  end
    
end

  # What's left?
  # x can see created invites

  # - controller to handle creating new invites
  # - assign invite to existing user?
  # - mail an invite

  

  
