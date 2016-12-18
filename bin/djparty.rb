require 'sinatra'
require 'haml'
require 'net/http'
require 'json'

# set :bind, '0.0.0.0'
set :port, 8080
set :static, true
set :public_folder, "static"
set :views, "views"

# def generateRandomString(length)
# 	text = ''
# 	possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

# 	length.times do |i|
# 		text += possible[Random.rand(possible.length)]
# 	end
# 	return text;
# end

get '/' do
    haml :index
end

get '/loadVideo' do
	uri = URI("https://www.youtube.com/results")
	# search_params = { :sp=> "EgIYAQ%253D%253D", :search_query=> params[:q]+" -album" }
	search_params = { :search_query=> params[:q] }
	uri.query = URI.encode_www_form(search_params)

	response = Net::HTTP.get_response(uri)

	videoId= response.body.match(/watch\?v=(.+?)"/).captures.first

	res= {:videoId=> videoId}
	return res.to_json

end

get '/join' do
	@partyName= params[:partyName]
	@partyPass= params[:partyPass]
	@guestName= params[:guestName]

	puts "--------"
	puts @partyName
	puts @guestName
	puts "--------"


	haml :join_api
end































