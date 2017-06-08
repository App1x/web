# require 'base64'
require 'haml'
require 'json'
require 'net/http'
require 'nokogiri'
require 'sinatra'

# set :bind, '0.0.0.0'
set :port, 8080
set :static, true
set :public_folder, "static"
set :views, "views"

def generateRandomString(length)
	text = ''
	possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

	length.times do |i|
		text += possible[Random.rand(possible.length)]
	end
	return text;
end

get '/' do
	# locals = {
	# 	:access_token  => params['access_token'],
	# 	:token_type 	 => params['token_type'],
	# 	:scope 			   => params['scope'],
	# 	:expires_in    => params['expires_in'],
	# 	:refresh_token => params['refresh_token']
	# }
	# puts "SCOPE:"
	# puts locals

	haml :index#, :locals=>locals
  # '<script src="script/spotify.js" type="text/javascript"></script><script src="script/jquery-3.1.1.min.js"  type="text/javascript"></script><script>requestAuthorization();</script>'
end

get '/searchYoutube' do
	uri = URI("https://www.youtube.com/results")
	# search_params = { :sp=> "EgIYAQ%253D%253D", :search_query=> params[:q]+" -album" }

	num_results   = params[:num_results].to_i
	search_params = {
		:search_query=> params[:q],
		:sp          => params[:video_type]
	}
	uri.query     = URI.encode_www_form(search_params)
	puts uri
	response      = Net::HTTP.get_response(uri)
	respons_html  = Nokogiri::HTML(response.body)

	results = respons_html.css('.yt-lockup-content')[0..num_results]
	count = 0
	results = results.map do |result|
		puts count+=1
		title_div    = result.css('.yt-lockup-title a')[0]
		channel_div  = result.css('.yt-lockup-byline')[0]
		duration_div = result.previous_element.css('.video-time')[0]
		puts title_div['href']
		videoId      = title_div['href'][/watch\?v=(.+)/, 1]
		title        = title_div['title']
		puts title
		channel      = channel_div.text
		puts channel
		puts "PREV: " + result.previous_element
		duration 		 = duration_div.text
		uri          = "https://www.youtube.com/watch?v=#{videoId}"

		{uri:uri, videoId:videoId, title:title, channel:channel, duration:duration}
	end

	res= {results:results}
	return res.to_json
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

get '/requestSpotAuthorization' do
	state = generateRandomString(16);
	uri = URI("https://accounts.spotify.com/authorize")
	params = {
		client_id: '7d7061da35dd47f387d4cb4aa309420a',
    response_type: 'code',
    redirect_uri: 'http://localhost:8080/',
    state: state
	}
	uri.query = URI.encode_www_form(params)
	puts "REQ AUTH URI:"
	puts uri
	# response  = Net::HTTP.get_response(uri)
	
	# response
	redirect uri
end

get '/spotifyAuthCallback' do
	code  = params['code']
	state = params['state']
	error = params['error']

	if error
		puts "SPOTIFY AUTH ERROR:"
		puts error
	else
		uri = URI("https://accounts.spotify.com/api/token")
		header = {'Content-Type': 'text/json'}
		params = {
			grant_type:'authorization_code',
			code:code,
			redirect_uri:'http://localhost:8080/spotifyAuthCallback',
			client_secret:'ce1dacbfca1a4c8ebf9fdc964ad5234d',
			client_id:'7d7061da35dd47f387d4cb4aa309420a'
		}

		response = `curl --data '#{URI.encode_www_form(params)}' 'https://accounts.spotify.com/api/token'`

		# uri.query = URI.encode_www_form(params)
		# puts "REQ TOKEN URI:"
		# puts uri
		# # req          = Net::HTTP::Post.new(uri)
		# # req['token'] = "Authorization #{Base64.encode64('7d7061da35dd47f387d4cb4aa309420a:ce1dacbfca1a4c8ebf9fdc964ad5234d')}"
		# http = Net::HTTP.new(uri.host, uri.port)
		# http.use_ssl = true
		# request = Net::HTTP::Post.new(uri.request_uri, header)
		# request.body = params.to_json
		# response = http.request(request)
		# puts response.body
		# response      = JSON.parse(response)
		# access_token  = response['access_token']
		# token_type 	  = response['token_type']
		# scope 			  = response['scope']
		# expires_in    = response['expires_in']
		# refresh_token = response['refresh_token']

		response
		# haml :index, :locals=>{spotifyAuthResponse:response}
	end


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































