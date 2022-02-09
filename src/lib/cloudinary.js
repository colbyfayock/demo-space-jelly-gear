import { setConfig, buildUrl } from 'cloudinary-build-url';

setConfig({
  cloudName: 'colbycloud'
})

export function buildRemoteUrl(image, options) {
  return buildUrl(image, {
    cloud: {
      storageType: 'fetch'
    },
    ...options
  })
}

export function buildUrlByPublicId(publicId, options) {
  return buildUrl(publicId, {
    ...options
  })
}