class DependenciesCheckJob < ActiveJob::Base
  queue_as :default

  def perform
    request = HTTPI::Request.new
    request.url = ENV["MONITOR_URL"]
    http = HTTPI.get(request, :httpclient)
    Rails.cache.write(:dependencies_report, http.raw_body)
  end
end
