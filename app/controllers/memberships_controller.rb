class MembershipsController < ApplicationController

  def update
    @org = Org.find( params[:org_id] )
    
    authorize! :manage, @org
    @membership = Membership.find(params[:membership])
    
    if params[:doing] == 'make-admin'
      @membership.admin = true
      @msg = @membership.user.email+'\'s now an admin for '+@org.name+'. Hope they don\'t screw up'
    elsif  params[:doing] == 'remove-admin'
      @membership.admin = false
      @msg = @membership.user.email+'\'s no longer an admin for '+@org.name+'. Couldn\'t handle it, could they?'
    else
      @membership.approved = true
      @msg = @membership.user.email+' has been added to '+@org.name
    end
    
    @membership.save 
    
    redirect_to org_path( @org.to_param), :notice =>  @msg
  end
  
  def add
    @org = Org.find( params[:org_id] )
    authorize! :manage, @org
    @membership = @org.memberships.new(:approved => true)
    if @membership.save
      @msg = 'success!'
    else
      @msg = 'faail'
    end
    redirect_to org_path(@org.to_param), :notice => @msg
  end

  def destroy
    @org = Org.find( params[:org_id] )
    authorize! :manage, @org
    @membership = Membership.find(params[:membership])
    @membership.destroy
    redirect_to  org_path( @org.to_param), :notice =>  'removed '+@membership.user.email+' from '+@org.name+'. Good riddence, amirite?'
  end

  def invite
    @org = Org.find(params[:org_id])
    @membership = Membership.find_by_org_id_and_invite_token(params[:org_id], params[:invite_token])
    
    if current_user.nil?
      session[:invite] = params[:invite_token]
      redirect_to new_user_registration_path
    else
      if current_user.add_membership(@membership)
        redirect_to org_path( @org.to_param ), :notice => 'You have been added to '+@org.name+', got get em tiger'
      else
        redirect_to root_url, :notice => 'Mmmm something went wrong'
      end
    end
  end

  def create
  end

end
