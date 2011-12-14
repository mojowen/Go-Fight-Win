require 'openid/store/filesystem'
Rails.application.config.middleware.use OmniAuth::Builder do
   provider :twitter, 'eN5mEpigjGUDOdS71gPkcA', 'aHeHcXPVWKPTJk9g6vvYSdANdhpsDb4dCKZm1Ot5Iwk'
   provider :facebook, '216845411708196', '2bee8032023022c2e90fbb5702b58a4b', {:scope => 'publish_stream,offline_access,email', :client_options => {:ssl => {:ca_file => '/usr/lib/ssl/certs/ca-certificates.crt'}}}
   provider :open_id, OpenID::Store::Filesystem.new('/tmp')
   provider :open_id, OpenID::Store::Filesystem.new('/tmp'), {:name => "google", :identifier => "https://www.google.com/accounts/o8/id", :required => [] }
end