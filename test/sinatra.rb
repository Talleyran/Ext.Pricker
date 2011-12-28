require 'sinatra'
require 'net/http'

set :public_folder, File.dirname(__FILE__) + '/../../'

get '/' do
    File.open(File.join(settings.public_folder, 'Ext.Pricker/example.html')).read
end

get '/OceanViewer2/translate' do
    puts '----------------------------'
    p params
    puts '----------------------------'
    Net::HTTP.get('oceanviewer.ru', "/OceanViewer2/translate?code=#{params[:code]}&type=#{params[:type]}")
end

post '/resources/wms' do
    puts '----------------------------'
    p params
    puts '----------------------------'
    uri = URI('http://oceanviewer.ru/resources/wms')
    res = Net::HTTP.post_form(uri, params)
    res.body
    #File.open(File.join(settings.public_folder, 'Ext.Pricker/test/geoserver-GetFeatureInfo.plain')).read
end
