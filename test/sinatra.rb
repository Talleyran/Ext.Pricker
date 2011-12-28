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

get '/resources/wms' do
    puts '----------------------------'
    p params
    puts '----------------------------'
    Net::HTTP.get('oceanviewer.ru', "/resources/wms?#{params.map{|k,v|"#{k}=#{v}"}.join('&')}")
    #File.open(File.join(settings.public_folder, 'Ext.Pricker/test/geoserver-GetFeatureInfo.plain')).read
end
