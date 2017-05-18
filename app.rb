require 'sinatra'
# require 'net/http'
# require 'json'

set :root, File.dirname(__FILE__)
set :public_folder, 'dist'
set :bind, '0.0.0.0'

get '/' do
  File.read('dist/index.html')
end

get '/loadvideo' do
  uri = URI("https://www.youtube.com/results")
	# search_params = { :sp=> "EgIYAQ%253D%253D", :search_query=> params[:q]+" -album" }
	search_params = { :search_query=> params[:q] }
	uri.query = URI.encode_www_form(search_params)

	response = Net::HTTP.get_response(uri)

	videoId= response.body.match(/watch\?v=(.+?)"/).captures.first

	res= {:videoId=> videoId}
	return res.to_json
end