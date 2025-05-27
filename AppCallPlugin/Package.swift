// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "CallmePlugin",
    platforms: [.iOS(.v14)],
    products: [
        .library(
            name: "CallmePlugin",
            targets: ["CallmePluginPlugin"])
    ],
    dependencies: [
        .package(url: "https://github.com/ionic-team/capacitor-swift-pm.git", from: "7.0.0")
    ],
    targets: [
        .target(
            name: "CallmePluginPlugin",
            dependencies: [
                .product(name: "Capacitor", package: "capacitor-swift-pm"),
                .product(name: "Cordova", package: "capacitor-swift-pm")
            ],
            path: "ios/Sources/CallmePluginPlugin"),
        .testTarget(
            name: "CallmePluginPluginTests",
            dependencies: ["CallmePluginPlugin"],
            path: "ios/Tests/CallmePluginPluginTests")
    ]
)