export interface Tool {
  id: string;
  name: string;
  description: string;
  category: 'text' | 'image' | 'other' | 'test';
  icon?: string;
  href: string;
}

export const tools: Tool[] = [
  // Text Tools
  // {
  //   id: 'text-case',
  //   name: 'Text Case Converter',
  //   description: 'Convert text between uppercase, lowercase, and other case formats',
  //   category: 'text',
  //   href: '/tools/text-case'
  // },
  // {
  //   id: 'text-encode',
  //   name: 'Text Encoding Converter',
  //   description: 'Encode and decode text using Base64, URL encoding, and more',
  //   category: 'text',
  //   href: '/tools/text-encode'
  // },
  {
    id: 'text-diff',
    name: 'Text Diff',
    description: 'Compare differences between two text documents',
    category: 'text',
    href: '/tools/text/diff'
  },
  // {
  //   id: 'text-count',
  //   name: 'Text Counter',
  //   description: 'Count characters, words, lines, and paragraphs',
  //   category: 'text',
  //   href: '/tools/text/counter'
  // },
  // Image Tools
  {
    id: 'image-compress',
    name: 'Image Compressor',
    description: 'Compress image file size while maintaining quality',
    category: 'image',
    href: '/tools/image/compressor'
  },
  {
    id: 'image-crop',
    name: 'Image Cropper',
    description: 'Crop and adjust image dimensions',
    category: 'image',
    href: '/tools/image/cropper'
  },
  // {
  //   id: 'image-convert',
  //   name: 'Image Format Converter',
  //   description: 'Convert images between formats (JPG, PNG, WebP, etc.)',
  //   category: 'image',
  //   href: '/tools/image/format-convert'
  // },
  // Other Tools
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes from text or URLs',
    category: 'other',
    href: '/tools/qr-generator'
  },
  // {
  //   id: 'color-picker',
  //   name: 'Color Picker',
  //   description: 'Pick and manage colors with various formats',
  //   category: 'other',
  //   href: '/tools/color-picker'
  // },
  // {
  //   id: 'json-formatter',
  //   name: 'JSON Formatter',
  //   description: 'Format and validate JSON data',
  //   category: 'other',
  //   href: '/tools/json-formatter'
  // },
  // {
  //   id: 'hash-generator',
  //   name: 'Hash Generator',
  //   description: 'Generate hash values (MD5, SHA256, SHA512, etc.)',
  //   category: 'other',
  //   href: '/tools/hash-generator'
  // },

  {
    id: 'test-microphone',
    name: 'Test Microphone',
    description: 'A tool for testing microphone functionality',
    category: 'test',
    href: '/tools/test/microphone'
  }
];

export const toolsByCategory = {
  text: tools.filter(t => t.category === 'text'),
  image: tools.filter(t => t.category === 'image'),
  other: tools.filter(t => t.category === 'other'),
  test: tools.filter(t => t.category === 'test'),
};
