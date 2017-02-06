require 'webpack_helper_rails/view_helpers'
require 'webpack_helper_rails/configuration'

module WebpackHelperRails
  class Railtie < ::Rails::Railtie

    # initializer 'webpack_helper.add_manifest' do |app|
    #   manifest_path = WebpackHelperRails::Configuration.instance.manifest_path
    #   app.config.webpack_manifest = File.exist?(manifest_path) ? JSON.parse(File.read(manifest_path)) : {}
    # end

    config.after_initialize do
      manifest_path = WebpackHelperRails::Configuration.instance.manifest_path
      config.webpack_manifest = File.exist?(manifest_path) ? JSON.parse(File.read(manifest_path)) : {}
    end

    initializer 'webpack_helper.add_view_helpers' do |_app|
      ActionView::Base.send :include, WebpackHelperRails::ViewHelpers
    end

    generators do
      require 'webpack_helper_rails/generators/install_generator'
    end

  end
end
