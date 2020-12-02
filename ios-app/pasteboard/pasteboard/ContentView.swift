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
        Text("Add Site").padding()
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
        }.padding()
    }
}

struct ContentView: View {
    private var addSite = AddSiteView()
    
    @ObservedObject private var siteCollection = SiteCollection()
    
    @State private var webView = WebViewWrapper()
    @State private var showAddSite = false;
    
    var body: some View {
        VStack {
            Text("Pasteboard")
            HStack {
                ForEach(self.siteCollection.values, id: \.name) { site in
                    HStack {
                        Button(action: {
                            let url: String = site.url;
                            self.webView.navigateTo(url: URL.init(string: url)!)
                        }) {
                            Text(site.name)
                        }
                        Button(action: {
                            let name: String = site.name;
                            self.siteCollection.remove(name: name)
                        }) {
                            Text("-")
                        }.padding()
                    }.padding()
                }
                Button(action: {
                    self.showAddSite = true;
                }) {
                    Text("+")
                }.padding()
            }
            self.webView
        }
        .sheet(isPresented: $showAddSite) {
            self.addSite
            
            HStack {
                Button(action: {
                    let name: String = self.addSite.name.value;
                    let url: String = self.addSite.url.value;

                    self.siteCollection.add(name: name, url: url);
                    self.showAddSite = false;
                }) {
                    Text("Add Site")
                }.padding()
                Button(action: {
                    self.showAddSite = false;
                }) {
                    Text("Cancel")
                }.padding()
            }.padding()
        }
    }
}

struct ContentView_Previews: PreviewProvider {
    let urlRequest: URLRequest
    
    static var previews: some View {
        ContentView()
    }
}
