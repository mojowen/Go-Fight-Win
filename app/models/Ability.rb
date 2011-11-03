class Ability
  include CanCan::Ability

  def initialize(user)
    user ||= User.new # guest user (not logged in)

    
    can :read, Org, :users => { :id => user.id }
    can :read, Org do |org|
      !org.parents.each{ |parent| can? :read, parent }.empty?
    end
 
    can :manage, Org, :memberships => { :user_id => user.id, :admin => true }
    can :manage, Org do |org|
       !org.parents.each{ |p| can? :manage, p }.empty?
    end


  end
end
