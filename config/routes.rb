Gfw::Application.routes.draw do

  # For authentication and logging in
  services = %w[twitter google facebook ~]
  # For services that orgs can't overwrige
  administrative = %w[users authentications assets]
  
  match '/auth/:provider/callback' => 'authentications#create', :constraints => lambda{|req| services.include?(req.params[:provider]) },  :as => 'new_auth'
  resources :authentications
  devise_for :users, :controllers => { :registrations => 'registrations'}
  
  # If logged in will take to org index, otherwise home page
  root :to => "home#index", :constraints => lambda{|req| req.session['warden.user.user.key'].blank?}
  root :to => "org#index", :constraints => lambda{|req| !req.session['warden.user.user.key'].blank?}
  match '/notice' => "home#notice", :as => 'notice'
  
  # Allows for discrete and non-discrete linking to orgs
  match '/:org_id' => 'org#show', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'org_discrete'
  match '/:org_name' => 'org#show', :constraints => lambda{|req| !administrative.include?(req.params[:org_name]) }, :as => 'org'

  # Membership management routes
  match '/:org_id/~/:membership/destroy' => 'memberships#destroy', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'destroy_membership'
  match '/:org_id/~/:membership/update' => 'memberships#update', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'update_membership'
  match '/:org_id/~/invite/create' => 'memberships#add', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'add_membership'
  match '/:org_id/~/invite/:invite_token' => 'memberships#invite', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'invite_membership'

  #List management routes
  match '/:org_id/~/create' => 'lists#create', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'list_create', :via => [:put, :post]
  match '/:org_id/~/new' => 'lists#new', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id]}, :as => 'list_new'

  match '/:org_name/:list_name/update' => 'lists#update', :constraints => lambda{|req| !services.include?(req.params[:list_name]) && !administrative.include?(req.params[:org_name]) }, :as => 'list_update', :via => [:put, :post]
  match '/:org_name/:list_name/~edit' => 'lists#edit', :constraints => lambda{|req| !services.include?(req.params[:list_name]) && !administrative.include?(req.params[:org_name]) }, :as => 'list_edit'
  match '/:org_name/:list_name/~edit/update' => 'lists#update_list', :constraints => lambda{|req| !services.include?(req.params[:list_name]) && !administrative.include?(req.params[:org_name]) }, :as => 'list_admin_update', :via => [:put, :post]
  match '/:org_name/:list_name' => 'lists#show', :constraints => lambda{|req| !services.include?(req.params[:list_name]) && !administrative.include?(req.params[:org_name])}, :as => 'list'
  
  #Views with list
  match '/:org_name/:list_name/:view_name' => 'lists#show', :constraints => lambda{|req| !services.include?(req.params[:list_name]) && !administrative.include?(req.params[:org_name])}, :as => 'view'
  match '/:org_id/:list_id/:view_slug' => 'lists#show', :constraints => lambda {|req| /^[-+]?[0-9]+$/ === req.params[:org_id] && /^[-+]?[0-9]+$/ === req.params[:list_id] }, :as => 'view_discrete'
  
end
