module WebpackHelperRails
  module ViewHelpers

    def webpack_find_asset(logical_path)
      if Rails.configuration.webpack_manifest.has_key?(logical_path)
        asset_path = Rails.configuration.webpack_manifest.fetch(logical_path)
        Rails.logger.debug { "[webpack assets] Found asset #{asset_path.inspect}" }
        asset_path
      else
        Rails.logger.debug { "[webpack assets] Can't find asset path for #{logical_path} in manifest." }
        nil
      end
    end

    def webpack_asset_js(source)
      webpack_find_asset("#{source}.js")
    end

    def webpack_asset_css(source)
      webpack_find_asset("#{source}.css")
    end

    def webpack_css_link_tag(*sources)
      options = sources.extract_options!.symbolize_keys

      sources.uniq.map { |source| webpack_asset_css(source) }.compact.map { |href|
        tag :link, {rel: 'stylesheet', media: 'screen', href: href}.merge(options)
      }.join("\n").html_safe
    end

    def webpack_js_include_tag(*sources)
      options = sources.extract_options!.symbolize_keys

      sources.uniq.map { |source| webpack_asset_js(source) }.compact.map { |src|
        content_tag 'script'.freeze, '', {src: src}.merge(options)
      }.join("\n").html_safe
    end

  end
end