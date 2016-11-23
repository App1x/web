# coding: utf-8
lib = File.expand_path('../lib', __FILE__)
$LOAD_PATH.unshift(lib) unless $LOAD_PATH.include?(lib)

Gem::Specification.new do |spec|
  spec.name          = "djparty"
  spec.version       = '1.0'
  spec.authors       = ["Nicholas Papadopoulos"]
  spec.email         = ["npapa1994@gmail.com"]
  spec.summary       = %q{Play music with friends.}
  spec.description   = %q{Choose songs and play round-robin style.}
  spec.homepage      = "http://djparty.com/"
  # spec.license       = "MIT"

  spec.files         = ['lib/djparty.rb']
  spec.executables   = ['bin/djparty']
  spec.test_files    = ['tests/test_djparty.rb']
  spec.require_paths = ["lib"]
end