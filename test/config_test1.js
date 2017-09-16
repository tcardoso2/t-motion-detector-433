profiles = {
  default: {
    Environment: {
      params: {
        name: "My Test Environment"
      }
    },
    R433Detector: {
      name: "R433 MD",
      pin: 17
    },
    BaseNotifier: {
    }
  }
}

exports.profiles = profiles;
exports.default = profiles.default;