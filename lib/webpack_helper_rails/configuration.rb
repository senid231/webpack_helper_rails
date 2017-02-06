require 'pathname'

module WebpackHelperRails
  class Configuration
    include Singletong

    attr_accessor :manifest_relative_path

    def initialize
      self.manifest_relative_path = Pathname.new('config').join('manifest.json').to_s
    end

    def manifest_path
      Rails.root.join(self.manifest_relative_path)
    end

  end
end