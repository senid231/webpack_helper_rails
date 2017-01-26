# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)
require 'webpack_helper_rails/version'

Gem::Specification.new do |spec|
  spec.name          = 'webpack_helper_rails'
  spec.version       = WebpackHelperRails::VERSION
  spec.authors       = ['Denis Talakevich']
  spec.email         = ['senid231@gmail.com']

  spec.summary       = %q{allow to use webpack for generating assets}
  spec.description   = %q{allow to use webpack for generating assets}
  spec.homepage      = 'https://github.com/senid231/webpack_helper_rails'
  spec.license       = 'MIT'

  spec.files         = `git ls-files -z`.split("\x0").reject { |f| f.match(%r{^(test|spec|features)/}) }
  spec.executables   = spec.files.grep(%r{^exe/}) { |f| File.basename(f) }
  spec.require_paths = ['lib']

  spec.add_dependency 'rails'

  spec.add_development_dependency 'bundler', '~> 1.8'
  spec.add_development_dependency 'rake', '~> 10.0'
  spec.add_development_dependency 'rspec'
end
