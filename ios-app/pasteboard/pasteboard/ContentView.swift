//
//  ContentView.swift
//  pasteboard
//
//  Created by Nick Funk on 11/30/20.
//

import SwiftUI
import WebKit;
import Foundation;

class LocalStorage {
    private static let key: String = "pasteboard_store";
    
    public static var value: String {
        set {
            UserDefaults.standard.set(newValue, forKey: key)
        }
        get {
            return UserDefaults.standard.string(forKey: key) ?? ""
        }
    }
    
    public static func removeValue() {
        UserDefaults.standard.removeObject(forKey: key)
    }
}

class Site: ObservableObject {
    @Published public var name: String = ""
    @Published public var url: String = ""
    
    init(name: String, url: String) {
        self.objectWillChange.send()
        self.name = name;
        self.url = url;
    }
}

class SiteCollection: ObservableObject {
    @Published public var values: [Site] = [];
    
    init() {
        load();
    }
    
    func add(name: String, url: String) {
        self.objectWillChange.send()
        self.values.append(Site.init(name: name, url: url))
        
        serialize()
    }
    
    func remove(name: String) {
        if let index = self.values.firstIndex(where: {
            site in
            return site.name == name
        }) {
            self.objectWillChange.send()
            self.values.remove(at: index)
            
            serialize()
        }
    }
    
    func serialize() {
        var keyValue: String = "";
        for site in self.values {
            keyValue.append(site.name + "," + site.url + ",");
        }
        
        LocalStorage.value = keyValue;
    }
    
    func load() {
        let raw = LocalStorage.value;
        let values = raw.components(separatedBy: ",").filter {
            value in
            value.count > 0
        };
        
        if (values.count < 2) {
            return;
        }
        
        for i in 0..<values.count {
            if (i % 2 == 0) {
                let name = values[i];
                let url = values[i + 1];
                
                self.add(name: name, url: url);
            }
        }
    }
}

final class WebViewWrapper : UIViewRepresentable {
    private var view = WKWebView();
    
    init() {
    }
    
    func makeUIView(context: Context) -> WKWebView {
        self.view = WKWebView();
        return self.view;
    }
    
    func navigateTo(url: URL) {
        let request = URLRequest(url: url);
        self.view.load(request);
    }
    
    func updateUIView(_ uiView: WKWebView, context: Context) {
        
    }
}

class ObservedText: ObservableObject {
    @Published var value = ""
}

struct AddSiteView : View {
    @ObservedObject public var name = ObservedText()
    @ObservedObject public var url = ObservedText()
    
    var body: some View {
        Text("Add a new site").padding()
        VStack {
            Text("Name")
            
            TextField("name", text: Binding(
                get: {
                    return self.name.value;
                },
                set: {
                    newValue in
                    self.name.objectWillChange.send();
                    return self.name.value = newValue;
                }
            ))
            .padding()
            
            Text("URL")
            
            TextField("url", text: Binding(
                get: {
                    return self.url.value;
                },
                set: {
                    newValue in
                    self.url.objectWillChange.send();
                    return self.url.value = newValue;
                }
            ))
            .padding()
        }.padding()
    }
}

struct NeumorphicButtonStyle: ButtonStyle {
    var backgroundColor: Color
    var foregroundColor: Color

    func makeBody(configuration: Self.Configuration) -> some View {
        configuration.label
            .padding(10)
            .background(
                ZStack {
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .blendMode(.overlay)
                    RoundedRectangle(cornerRadius: 10, style: .continuous)
                        .fill(backgroundColor)
                }
        )
            .scaleEffect(configuration.isPressed ? 0.95: 1)
            .foregroundColor(foregroundColor)
            .animation(.spring())
    }
}

struct ContentView: View {
    private var addSite = AddSiteView()
    
    @ObservedObject private var siteCollection = SiteCollection()
    
    @State private var webView = WebViewWrapper()
    
    @State private var showAddSite = false;
    @State private var showSites = false;
    
    var body: some View {
        VStack {
            Text("Pasteboard")
            
            self.webView
            
            HStack {
                Button(action: {
                    self.showSites = true;
                }) {
                    Text("Sites")
                }.buttonStyle(
                    NeumorphicButtonStyle(
                        backgroundColor: .blue,
                        foregroundColor: .white
                    )
                )
                .frame(minWidth: 100)
                .padding()
                .sheet(isPresented: self.$showSites) {
                    VStack {
                        HStack {
                            Text("Sites")
                                .padding()
                        }
                        .frame(minWidth: 0, maxWidth: .infinity)
                        
                        ScrollView(.vertical) {
                            VStack {
                                ForEach(self.siteCollection.values, id: \.name) { site in
                                    HStack {
                                        Button(action: {
                                            let name: String = site.name;
                                            self.siteCollection.remove(name: name)
                                        }) {
                                            Image(systemName: "trash")
                                        }.buttonStyle(
                                            NeumorphicButtonStyle(
                                                backgroundColor: .red,
                                                foregroundColor: .white
                                            )
                                        )
                                        
                                        Button(action: {
                                            let url: String = site.url;
                                            self.webView.navigateTo(url: URL.init(string: url)!)
                                            
                                            self.showSites = false;
                                        }) {
                                            Text(site.name)
                                        }
                                        .buttonStyle(
                                            NeumorphicButtonStyle(
                                                backgroundColor: .blue,
                                                foregroundColor: .white
                                            )
                                        )
                                        .frame(minWidth: 150, maxWidth: .infinity)
                                        .padding()
                                    }.padding()
                                }
                            }.frame(minWidth: 0, maxWidth: .infinity, minHeight: 0, maxHeight: .infinity)
                        }
                        
                        HStack {
                            Button(action: {
                                self.showAddSite = true;
                            }) {
                                Image(systemName: "plus")
                            }.buttonStyle(
                                NeumorphicButtonStyle(
                                    backgroundColor: .green,
                                    foregroundColor: .white
                                )
                            )
                            .padding()
                            .sheet(isPresented: self.$showAddSite) {
                                self.addSite
                                HStack {
                                    Button(action: {
                                        let name: String = self.addSite.name.value;
                                        let url: String = self.addSite.url.value;

                                        self.siteCollection.add(name: name, url: url);
                                        
                                        self.showAddSite = false;
                                    }) {
                                        Text("Submit")
                                    }
                                    .buttonStyle(
                                        NeumorphicButtonStyle(
                                            backgroundColor: .green,
                                            foregroundColor: .white
                                        )
                                    )
                                    .padding()
                                    
                                    Button(action: {
                                        self.showAddSite = false;
                                    }) {
                                        Text("Cancel")
                                    }
                                    .buttonStyle(
                                        NeumorphicButtonStyle(
                                            backgroundColor: .gray,
                                            foregroundColor: .white
                                        )
                                    )
                                    .padding()
                                }.padding()
                            }
                            
                            Button(action: {
                                self.showSites = false;
                            }) {
                                Text("Cancel")
                            }.buttonStyle(
                                NeumorphicButtonStyle(
                                    backgroundColor: .gray,
                                    foregroundColor: .white
                                )
                            )
                            .padding()
                        }
                        .frame(minWidth: 0, maxWidth: .infinity)
                    }
                }
            }
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    let urlRequest: URLRequest
    
    static var previews: some View {
        ContentView()
    }
}
