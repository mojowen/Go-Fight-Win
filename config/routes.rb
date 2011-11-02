Gfw::Application.routes.draw do
  match '/auth/:provider/callback' => 'authentications#create'
  resources :authentications
  devise_for :users, :controllers => { :registrations => 'registrations'}
  root :to => "home#index"
  
end
