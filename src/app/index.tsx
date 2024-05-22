import { useEffect, useState } from "react";
import { FlatList, Platform, StatusBar, TouchableOpacity, View } from "react-native";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Dropdown } from "react-native-element-dropdown";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { BannerAd, BannerAdSize, TestIds} from "react-native-google-mobile-ads";
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

const VERSION_STORAGE = "@womans-bible-gracetech:version";
const BOOK_STORAGE = "@womans-bible-gracetech:book";
const VERSE_STORAGE = "@womans-bible-gracetech:verse";
const SIZE_STORAGE = "@womans-bible-gracetech:font-size";

export default function Home() {
  const insets = useSafeAreaInsets();

  const versionSelector: Selector[] = [
    { label: "NVI", value: "nvi" },
    { label: "ACF", value: "acf" },
    { label: "RA", value: "ra" },
  ]

  const [loading, setLoading] = useState(false);
  const [verses, setVerses] = useState<Verses[]>([]);
  const [versionSelected, setVersionSelected] = useState<Selector>();
  const [bookSelector, setBookSelector] = useState<Selector[]>([]);
  const [bookSelected, setBookSelected] = useState<Selector>();
  const [verseSelector, setVerseSelector] = useState<Selector[]>([]);
  const [verseSelected, setVerseSelected] = useState<Selector>();
  const [fontSize, setFontSize] = useState(14);

  async function increaseFontSize() {
    if (fontSize === 26) return;
    const newFontSize = fontSize + 1;

    await AsyncStorage.setItem(SIZE_STORAGE, newFontSize.toString());
    setFontSize(newFontSize);
  }

  async function decreaseFontSize() {
    if (fontSize === 10) return;
    const newFontSize = fontSize - 1;

    await AsyncStorage.setItem(SIZE_STORAGE, newFontSize.toString());
    setFontSize(newFontSize);
  }

  function handlePrevVerse() {
    if (!verseSelected) return;

    if (verseSelected.value === "1") return;

    const verse = parseInt(verseSelected.value);
    setVerseSelected(verseSelector[verse - 2]);
  }

  function handleNextVerse() {
    if (!verseSelected) return;

    const verse = parseInt(verseSelected.value);
    if (verseSelector[verse] !== undefined) {
      setVerseSelected(verseSelector[verse]);
    }
  }

  async function getData() {
    if (!versionSelected || !bookSelected || !verseSelected) return;

    setLoading(true);
    try {
      const version = versionSelected.value;
      const book = bookSelected.value;
      const verse = verseSelected.value;

      await AsyncStorage.setItem(BOOK_STORAGE, book);
      await AsyncStorage.setItem(VERSE_STORAGE, verse);

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
      }
    } catch(error) {
      console.warn(error);
    } finally {
      setLoading(false);
    }
  }

  async function restoreVersion() {
    const versionData = await AsyncStorage.getItem(VERSION_STORAGE);
    if (versionData) {
      const filtered = versionSelector.filter(item => item.value === versionData);
      setVersionSelected(filtered[0]);
    } else {
      setVersionSelected(versionSelector[0]);
    }

    const books: Selector[] = [];
    data.data.map(item => {
      books.push({
        value: item.abbrev,
        label: item.title,
      });
    });
    setBookSelector(books);

    const bookData = await AsyncStorage.getItem(BOOK_STORAGE);
    if (bookData) {
      const selected = books.filter(item => item.value === bookData);
      if (selected) {
        setBookSelected(selected[0]);
      }
    } else {
      setBookSelected(books[0]);
    }
  }

  useEffect(() => {
    getData();
  }, [verseSelected]);

  useEffect(() => {
    async function prepare() {
      if (!bookSelected) return;

      const bookFiltered = data.data.filter(item => item.title === bookSelected.label);
      if (bookFiltered.length > 0) {
        const verseList: Selector[] = [];
        for(let i = 1; i <= bookFiltered[0].chapters; i++) {
          verseList.push({
            value: i.toString(),
            label: i.toString(),
          });
        }
        setVerseSelector(verseList);

        const verseData = await AsyncStorage.getItem(VERSE_STORAGE);
        if (verseData) {
          if (verseData === bookSelected.value) {
            const filtered = verseList.filter(item => item.value === verseData);
            if (filtered) {
              setVerseSelected(filtered[0]);
            }
          } else {
            setVerseSelected(verseList[0]);
          }
        } else {
          setVerseSelected(verseList[0]);
        }
      }
    }

    prepare();
  }, [bookSelected]);

  useEffect(() => {
    async function prepare() {
      if (versionSelected) {
        await AsyncStorage.setItem(VERSION_STORAGE, versionSelected.value);
      }
      await getData();
    }

    prepare();
  }, [versionSelected]);

  useEffect(() => {
    async function prepare() {
      await restoreVersion();
    }

    prepare();
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
            selectedTextStyle={{
              fontSize: fontSize,
              paddingLeft: 8,
              color: "#FF699B",
            }}
            itemTextStyle={{
              fontSize: fontSize,
              color: "#FF699B",
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE",
            }}
            data={versionSelector}
            labelField="label"
            valueField="value"
            value={versionSelected}
            onChange={item => setVersionSelected(item)}
          />

          <View style={{ width: 1, height: "50%", backgroundColor: "#AAAAAA" }} />

          <Icon onPress={increaseFontSize}>
            <MaterialIcons name="text-increase" color="#FF699B" size={20} />
          </Icon>

          <View style={{ width: 1, height: "50%", backgroundColor: "#AAAAAA" }} />

          <Icon onPress={decreaseFontSize}>
            <MaterialIcons name="text-decrease" color="#FF699B" size={20} />
          </Icon>
        </View>

        <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 16, marginVertical: 8 }}>
          <Dropdown
            style={{
              flex: 4,
              borderColor: "#FF699B",
              borderWidth: 1,
              borderRadius: 6,
              paddingVertical: 6,
            }}
            selectedTextStyle={{
              fontSize: fontSize,
              paddingLeft: 8,
              color: "#FF699B",
            }}
            itemTextStyle={{
              fontSize: fontSize,
              color: "#FF699B",
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE",
            }}
            data={bookSelector}
            labelField="label"
            valueField="value"
            value={bookSelected}
            onChange={item => setBookSelected(item)}
          />

          <Dropdown
            style={{
              flex: 1,
              borderColor: "#FF699B",
              borderWidth: 1,
              borderRadius: 6,
              paddingVertical: 6,
            }}
            selectedTextStyle={{
              fontSize: fontSize,
              paddingLeft: 8,
              color: "#FF699B",
            }}
            itemTextStyle={{
              fontSize: fontSize,
              color: "#FF699B",
            }}
            itemContainerStyle={{
              backgroundColor: "#FCEBFE",
            }}
            data={verseSelector}
            labelField="label"
            valueField="value"
            value={verseSelected}
            onChange={item => setVerseSelected(item)}
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
          requestOptions={{ requestNonPersonalizedAdsOnly: true }}
        />
      </View>
    </>
  );
}