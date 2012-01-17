require 'sinatra'
require 'net/http'

set :public_folder, File.dirname(__FILE__) + '/../../'

get '/' do
    File.open(File.join(settings.public_folder, 'Ext.Pricker/examples/example.html')).read
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
    #Net::HTTP.get('oceanviewer.ru', "/resources/wms?code=#{params[:code]}&type=#{params[:type]}")
    #puts "http://oceanviewer.ru/resources/wms?#{params.map{|k,v|"#{k}=#{v}"}.join('&')}"
    #raise 'test exeption' if rand > 0.5
    uri = URI('http://oceanviewer.ru/resources/wms')
    res = Net::HTTP.post_form(uri, params)
    res.body
    #File.open(File.join(settings.public_folder, 'Ext.Pricker/test/geoserver-GetFeatureInfo.plain')).read
end
