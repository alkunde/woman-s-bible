import { useEffect, useState } from "react";
import { FlatList, Platform, StatusBar, TouchableOpacity, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerAd, BannerAdSize, TestIds } from "react-native-google-mobile-ads";
import axios from "axios";

import { Icon } from "@/components/icon";
import { Loading } from "@/components/loading";
import { Verse } from "@/components/verse";
import data from "@/utils/books.json";

type Verses = {
  verseNumber: string;
  verseText: string;
}

type Selector = {
  label: string;
  value: string;
}

const adId = Platform.select({
  android: "ca-app-pub-3200984351467142/4121512481",
  ios: "ca-app-pub-3200984351467142/9321868275",
  default: "",
});

const STORAGE = "@womans-bible-gracetech:bible";
const SIZE_STORAGE = "@womans-bible-gracetech:font-size";

export default function Home() {
  const insets = useSafeAreaInsets();

  const [loading, setLoading] = useState(true);
  const [verses, setVerses] = useState<Verses[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<Selector | null>(null);
  const [bookSelector, setBookSelector] = useState<Selector[]>([]);
  const [selectedBook, setSelectedBook] = useState<Selector | null>(null);
  const [verseSelector, setVerseSelector] = useState<Selector[]>([]);
  const [selectedVerse, setSelectedVerse] = useState<Selector | null>(null);
  const [fontSize, setFontSize] = useState(14);

  const versionSelector: Selector[] = [
    {
      label: "NVI",
      value: "nvi",
    },
    {
      label: "ACF",
      value: "acf",
    },
    {
      label: "RA",
      value: "ra",
    }
  ]

  async function getData(version: string, book: string, verse: string) {
    setLoading(true);
    try {
      const response = await axios.get(`https://www.abibliadigital.com.br/api/verses/${version}/${book}/${verse}`, {
        headers: {
          "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdHIiOiJUaHUgTWF5IDAyIDIwMjQgMTc6NTY6MDUgR01UKzAwMDAubW9iaWxldGticmF6aWxAZ21haWwuY29tIiwiaWF0IjoxNzE0NjcyNTY1fQ.Y1WzktJsATf_UehI0WNE1nM55drvb_5LOZvBwXLmvZY"
        }
      });

      if (response.status === 200) {
        const items: Verses[] = response.data.verses.map((item: any) => {
          return {
            verseNumber: item.number,
            verseText: item.text,
          }
        });
        setVerses(items);
      } else {
        console.warn("internet error");
      }
    } catch(error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }

  function handlePrevVerse() {
    if (selectedVerse === null) return;

    if (selectedVerse.value === "1") return;

    const verse = parseInt(selectedVerse.value);
    setSelectedVerse(verseSelector[verse - 2]);
  }

  function handleNextVerse() {
    if (selectedVerse === null) return;

    const verse = parseInt(selectedVerse.value);
    if (verseSelector[verse] !== undefined) {
      setSelectedVerse(verseSelector[verse]);
    }
  }

  async function increaseFontSize() {
    if (fontSize == 26) return;
    const newFontSize = fontSize + 1;

    await AsyncStorage.setItem(SIZE_STORAGE, newFontSize.toString());
    setFontSize(newFontSize);
  }

  async function decreaseFontSize() {
    if (fontSize == 10) return;
    const newFontSize = fontSize - 1;

    await AsyncStorage.setItem(SIZE_STORAGE, newFontSize.toString());
    setFontSize(fontSize - 1);
  }

  async function getVerses() {
    if (selectedBook === null) return;

    const verse = await restoreLocalData();

    const bookFiltered = data.data.filter(item => item.title === selectedBook.label);
    if (bookFiltered.length > 0) {
      const verses: Selector[] = [];
      for (let i = 1; i <= bookFiltered[0].chapters; i++) {
        verses.push({
          value: i.toString(),
          label: i.toString(),
        });
      }
      setVerseSelector(verses);

      if (verse) {
        if (verse.book === selectedBook.value) {
          const filtered = verses.filter(item => item.value === verse.verse);
          if (filtered) {
            setSelectedVerse(filtered[0]);
          }
        } else {
          setSelectedVerse(verses[0]);
        }
      } else {
        setSelectedVerse(verses[0]);
      }
    }
  }

  async function saveCurrentRead() {
    if (selectedVersion === null || selectedBook === null || selectedVerse === null) return;

    getData(selectedVersion.value, selectedBook.value, selectedVerse.value);

    await AsyncStorage.setItem(
      STORAGE,
      JSON.stringify({
        version: selectedVersion.value,
        book: selectedBook.value,
        verse: selectedVerse.value,
      })
    );
  }

  useEffect(() => {
    saveCurrentRead();
  }, [selectedVerse]);

  useEffect(() => {
    getVerses();
  }, [selectedBook]);

  useEffect(() => {
    if (selectedVersion === null || selectedBook === null || selectedVerse === null) return;

    getData(selectedVersion.value, selectedBook.value, selectedVerse.value);
  }, [selectedVersion]);

  async function restoreLocalData() {
    const data = await AsyncStorage.getItem(STORAGE);
    if (data) {
      return JSON.parse(data);
    } else {
      return null;
    }
  }

  async function loadingScreen() {
    setLoading(true);

    const book = await restoreLocalData();

    const bookData: Selector[] = [];
    data.data.map(item => {
      bookData.push({
        value: item.abbrev,
        label: item.title,
      });
    });
    setBookSelector(bookData);

    if (book) {
      const versionSelect = versionSelector.filter(item => item.value === book.version);
      if (versionSelect) {
        setSelectedVersion(versionSelect[0]);
      }

      const selected = bookData.filter(item => item.value === book.book);
      if (selected) {
        setSelectedBook(selected[0]);
      }
    } else {
      setSelectedBook(bookData[0]);
    }

    await getVerses();
  }

  async function restoreFontSize() {
    const data = await AsyncStorage.getItem(SIZE_STORAGE);
    if (data) {
      setFontSize(parseInt(data));
    }
  }

  useEffect(() => {
    restoreFontSize();
    loadingScreen();
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={{ flex: 1, paddingTop: insets.top, backgroundColor: "#FCEBFE" }}>
        <View style={{ height: 56, flexDirection: "row", borderBottomWidth: 1, borderBottomColor: "#FF699B", alignItems: "center" }}>
          <View style={{ flex: 4 }} />

          <Dropdown
            style={{
              flex: 1.5,
              height: 40,
              borderColor: "#FF699B",
              borderWidth: 1,
              borderRadius: 6,
              marginRight: 8,
            }}
            selectedTextStyle={{ fontSize: fontSize, paddingLeft: 8, color: "#FF699B" }}
            itemTextStyle={{
              fontSize: fontSize
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE"
            }}
            data={versionSelector}
            labelField="label"
            valueField="value"
            value={selectedVersion}
            onChange={item => setSelectedVersion(item)}
          />

          <View style={{ width: 1, height: "50%", backgroundColor: "#AAAAAA", marginVertical: 16 }} />

          <Icon onPress={increaseFontSize}>
            <MaterialIcons name="text-increase" color="#FF699B" size={20} />
          </Icon>

          <View style={{ width: 1, height: "50%", backgroundColor: "#AAAAAA", marginVertical: 16 }} />

          <Icon onPress={decreaseFontSize}>
            <MaterialIcons name="text-decrease" color="#FF699B" size={20} />
          </Icon>
        </View>

        <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 16, marginVertical: 8 }}>
          <Dropdown
            style={{ flex: 4, borderColor: "#FF699B", borderWidth: 1, borderRadius: 6, paddingVertical: 6 }}
            selectedTextStyle={{ paddingLeft: 8, color: "#FF699B", fontSize: fontSize }}
            itemTextStyle={{
              color: "#FF699B",
              fontSize: fontSize,
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE"
            }}
            data={bookSelector}
            labelField="label"
            valueField="value"
            value={selectedBook}
            onChange={item => setSelectedBook(item)}
          />

          <Dropdown
            style={{ flex: 1, borderColor: "#FF699B", borderWidth: 1, borderRadius: 6, paddingVertical: 6 }}
            selectedTextStyle={{ paddingLeft: 8, color: "#FF699B", fontSize: fontSize }}
            itemTextStyle={{
              color: "#FF699B",
              fontSize: fontSize,
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE"
            }}
            data={verseSelector}
            labelField="label"
            valueField="value"
            value={selectedVerse}
            onChange={item => setSelectedVerse(item)}
          />
        </View>

        <View style={{ flex: 1 }}>
          {loading ? <Loading /> : (
            <FlatList
              data={verses}
              keyExtractor={(item) => item.verseNumber}
              renderItem={({ item }) => (
                <Verse
                  num={item.verseNumber}
                  total={verses.length.toString()}
                  texto={item.verseText}
                  fontSize={fontSize}
                />
              )}
              contentContainerStyle={{
                paddingHorizontal: 16,
                paddingBottom: 100,
              }}
              showsVerticalScrollIndicator={false}
            />
          )}

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FF699B",
              borderRadius: 24,
              bottom: 16,
              right: 16,
            }}
            onPress={handleNextVerse}
          >
            <FontAwesome
              name="chevron-right"
              color="white"
              size={18}
            />
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.7}
            style={{
              position: "absolute",
              width: 48,
              height: 48,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#FF699B",
              borderRadius: 24,
              bottom: 16,
              left: 16,
            }}
            onPress={handlePrevVerse}
          >
            <FontAwesome
              name="chevron-left"
              color="white"
              size={18}
            />
          </TouchableOpacity>
        </View>

        <BannerAd
          unitId={__DEV__ ? TestIds.ADAPTIVE_BANNER : adId}
          size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
          requestOptions={{
            requestNonPersonalizedAdsOnly: true
          }}
        />
      </View>
    </>
  );
}