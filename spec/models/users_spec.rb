require 'spec_helper'

describe User do
  
  it 'Destroy user and destroy it\'s authentications do' do 
    @user = Factory(:user)
    @user.save
    @auth = @user.authentications.new(:provider => 'twitter' )
    @auth.save
    @user.destroy
    @auth.should.equal? nil
  end

  context 'Testing User to Org connection via Membership' do
    before :each do
      @user = Factory(:user)
      @org = Factory(:org)
    end
    
    it 'does not connect org and user if membership is not approved' do
      @user.memberships.new(:org_id => @org.id ).save
      @user.orgs.first.should.equal? nil
    end
    
    it 'does connect org and user if membership is not approved' do
      @user.memberships.new(:org_id => @org.id, :approved => true ).save
      @user.orgs.first.should.equal? @org
    end
    
  end
  
end
