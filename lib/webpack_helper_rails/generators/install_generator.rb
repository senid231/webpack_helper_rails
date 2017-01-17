module WebpackHelperRails
  class InstallGenerator < Rails::Generators::Base
    source_root File.expand_path('../templates', __FILE__)

    def create_webpack_files
      copy_file 'package.json', 'package.json'
      copy_file 'webpack_config.js', 'webpack.config.babel.js'
      copy_file 'babel_rc.json', '.babelrc'
    end

  end
end