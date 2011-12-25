require 'sinatra'
require 'net/http'

set :public_folder, File.dirname(__FILE__) + '/../../'

get '/' do
    File.open(File.join(settings.public_folder, 'Ext.Pricker/example.html')).read
end

get '/translate?*' do
    Net::HTTP.get('oceanviewer.ru', "/OceanViewer2/translate?code=#{params[:code]}&type=#{params[:type]}")
end

get '/wms?*' do
    File.open(File.join(settings.public_folder, 'Ext.Pricker/test/geoserver-GetFeatureInfo.plain')).read
    #Net::HTTP.get('oceanviewer.ru', "/resources/ru_hydrometcentre_42/wms?#{params.map{|k,v|"#{k}=#{v}"}.join('&')}")
end
