require 'sinatra'
require 'haml'

set :port, 8080
set :static, true
set :public_folder, "static"
set :views, "views"

get '/' do
    haml :index
end

get '/hello/' do
    greeting = params[:greeting] || "Hi There"
    erb :index, :locals => {'greeting' => greeting}
end

# get '/public/:filename' do |filename|  #cheating way to get public working
# 	# $stdout.puts filename
# 	if filename[/\.js$/]
# 		send_file File.join('public/script', filename)
# 	elsif filename[/\.css$/]
# 		send_file File.join('public/style', filename)
# 	end
# end