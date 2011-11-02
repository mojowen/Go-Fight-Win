Gfw::Application.routes.draw do
  
  # For authentication and logging in
  match '/auth/:provider/callback' => 'authentications#create'
  resources :authentications
  devise_for :users, :controllers => { :registrations => 'registrations'}
  
  # If logged in will take to org index, otherwise home page
  root :to => "home#index", :constraints => lambda{|req| req.session['warden.user.user.key'].blank?}
  root :to => "org#index", :constraints => lambda{|req| !req.session['warden.user.user.key'].blank?}
  
  # Allows for discrete and non-discrete linking to orgs
  match '/:org_id' => 'org#show', :constraints => {:org_id => /[0-9]/}, :as => 'org_discrete'
  match '/:org_name' => 'org#show', :as => 'org'

  
end
