require 'webpack_helper_rails/version'
require'webpack_helper_rails/railtie'
require'webpack_helper_rails/configuration'

module WebpackHelperRails

  def self.configure
    yield configuration
  end

  def self.configuration
    WebpackHelperRails::Configuration.instance
  end

end
