require 'sinatra'
require 'net/http'

set :public_folder, File.dirname(__FILE__) + '/../../'

get '/' do
    redirect to 'Ext.Pricker/example.html'
end

get '/translate?*' do
    Net::HTTP.get('oceanviewer.ru', "/OceanViewer2/translate?code=#{params[:code]}&type=#{params[:type]}")
end

get '/wms?*' do
    Net::HTTP.get('oceanviewer.ru', "/resources/ru_hydrometcentre_42/wms?#{params}")
end
