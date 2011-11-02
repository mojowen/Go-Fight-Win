require 'spec_helper'

describe Membership do
  before :each do
    @user = Factory(:user)
    @org = Factory(:org)
  end
  
  it 'approved defaults to false' do
    @membership = Membership.new
    @membership.save
    @membership.approved.should be_false
  end
  
  it 'admin defaults approved' do
    @membership = Membership.new
    @membership.save
    @membership.admin.should be_false
  end
  
  it "belongs to a user" do
    @membership = Membership.new(:user_id => @user )
    @membership.save
    @membership.user.should.equal? @user
  end
  
  it 'is destroyed by user' do
    @membership = Membership.new(:user_id => @user )
    @membership.save
    @user.destroy
    @membership.should.equal? nil
  end
  
  it "belongs to an org" do
    @membership = Membership.new(:org_id => @org )
    @membership.save
    @membership.org.should.equal? @org
  end
  
  it 'is destroyable by an org' do 
    @membership = Membership.new(:org_id => @org )
    @membership.save
    @org.destroy
    @membership.should.equal? nil
  end

  it 'creates invite token of no user and approved' do
    @membership = Membership.new(:approved => true )
    @membership.save
    @membership.invite_token.length.should.equal? 22
  end
  
  it 'does not create an invite token if there\'s a user specified' do
    @membership = Membership.new(:approved => true, :user_id => @user.id )
    @membership.save
    @membership.invite_token.should.equal? nil
  end
end
