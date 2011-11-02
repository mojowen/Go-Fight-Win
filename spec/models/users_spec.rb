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

end
