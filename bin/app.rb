require 'sinatra'
require 'haml'
require 'rspotify'
require 'json'

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
    haml :index
end

get '/spotify_search' do
	track= params[:track] if params[:track]!=""
	artist= params[:artist] if params[:artist]!=""
	album= params[:album] if params[:album]!=""
	page= params[:page] || 1
	limit= params[:limit] || 5

	q= []
	# type= []
	type= ["track"]
	if track
		q<<track.gsub(" ", "+")
		# type<<"track"
	end
	if artist
		q<<artist.gsub(" ", "+")
		# type<<"artist"
	end
	if album
		q<<album.gsub(" ", "+")
		# type<<"album"
	end

	# q="track:#{track_query}%20artist:#{artist_query}%20album:#{album_query}&type=album,artist,track"
	# results= RSpotify::Track.search(q, limit:limit, offset:(5*(page-1)) )
	results= JSON.parse(`curl -X GET "https://api.spotify.com/v1/search?q=#{q.join("+")}&type=#{type.join(",")}&limit=#{limit}&offset=#{limit*(page-1)}" -H "Accept: application/json"`)

	output= {:originalResults=> results, :localResults=> ""}
	html= ""
	results["tracks"]["items"].each do |track, index|
		track_name= track["name"]
		artists= track["artists"].map{|artist| artist["name"]}.join(", ")
		uri= track["uri"]
		html+= "<tr><td uri=#{uri}><span id='track#{index}'>#{track_name}</span> - <span>#{artists}</span></td></tr>"
	end
	output[:localResults]= html

	return output.to_json
end

# get '/login' do
# 	stateKey = 'spotify_auth_state'
# 	state = generateRandomString(16)
# 	res.cookie(stateKey, state);

# 	# your application requests authorization
# 	var scope = 'user-read-private user-read-email';
# 	res.redirect('https://accounts.spotify.com/authorize?' +
# 	querystring.stringify({
# 		response_type: 'code',
# 		client_id: client_id,
# 		scope: scope,
# 		redirect_uri: redirect_uri,
# 		state: state
# 	}));
# end
