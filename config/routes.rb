Gfw::Application.routes.draw do

  # For authentication and logging in
  services = %w[twitter google facebook ~]
  # For services that orgs can't overwrige
  administrative = %w[users authentications]
  
  match '/auth/:provider/callback' => 'authentications#create', :constraints => lambda{|req| services.include?(req.params[:provider]) },  :as => 'new_auth'
  resources :authentications
  devise_for :users, :controllers => { :registrations => 'registrations'}
  
  # If logged in will take to org index, otherwise home page
  root :to => "home#index", :constraints => lambda{|req| req.session['warden.user.user.key'].blank?}
  root :to => "org#index", :constraints => lambda{|req| !req.session['warden.user.user.key'].blank?}
  
  # Allows for discrete and non-discrete linking to orgs
  match '/:org_id' => 'org#show', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'org_discrete'
  match '/:org_name' => 'org#show', :constraints => lambda{|req| !administrative.include?(req.params[:org_name]) }, :as => 'org'

  # Membership management routes
  match '/:org_id/~/:membership/destroy' => 'memberships#destroy', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'destroy_membership'
  match '/:org_id/~/:membership/update' => 'memberships#update', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'update_membership'
  match '/:org_id/~/invite/:invite_token' => 'memberships#invite', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'invite_membership'

  #List management routes
  match '/:org_name/:list_name' => 'lists#show', :constraints => lambda{|req| !services.include?(req.params[:list_name]) }, :as => 'list'
  
  #Views with list
  match '/:org_id/:list_id/:view_slug' => 'lists#show', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id] && /^[-+]?[0-9]+$/ === req.params[:list_id] }, :as => 'view_discrete'
  match '/:org_name/:list_name/:view_name' => 'lists#show', :constraints => lambda{|req| !services.include?(req.params[:list_name]) }, :as => 'view'
  
end
