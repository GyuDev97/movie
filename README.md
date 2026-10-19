# GyuLab Music Lyric Video Template

After Effects에서 실행하는 JSX 템플릿입니다. 한 곡의 WAV·SMI·앨범아트를 넣으면 모바일 쇼츠와 PC/YouTube용 가로 가사 영상을 만듭니다.

## 파일 구성

다른 PC로 아래 파일을 함께 복사합니다.

```text
GyuLab_Lyric_Video_Template.jsx       # 모바일: 1080 x 1920
GyuLab_Lyric_Video_PC_Template.jsx    # PC/YouTube: 1920 x 1080
README.md
```

현재 기본 곡 소스는 Windows 바탕화면에서 찾습니다. 다른 PC에서도 로그인 사용자명과 무관하게 동작합니다. 바탕화면에 아래 세 파일을 같은 이름으로 둡니다.

```text
공부는 안 했지만.wav
공부는 안 했지만_sync.smi
middle-school-career-guidance-album-art.png
```

파일이 없으면 빈 템플릿은 생성되지만, 음악·가사·앨범아트는 자동으로 채워지지 않습니다.

## 처음 한 번: 글꼴과 After Effects 설정

1. Windows에 **나눔고딕**을 설치합니다.
2. After Effects가 실행 중이었다면 완전히 종료한 뒤 다시 엽니다. 새 폰트를 읽기 위해 필요합니다.
3. After Effects에서 **Edit > Preferences > Scripting & Expressions**로 갑니다.
4. **Allow Scripts to Write Files and Access Network**를 켭니다.

JSX는 After Effects가 실제로 인식한 `NanumGothic`을 우선 사용합니다. 인식되지 않으면 설치된 맑은 고딕으로 대체되어, 없는 폰트 때문에 스크립트가 멈추지 않습니다.

## 모바일 쇼츠 / Reels 템플릿 실행

1. After Effects에서 새 프로젝트를 엽니다.
2. **File > Scripts > Run Script File…** 을 선택합니다.
3. `GyuLab_Lyric_Video_Template.jsx`를 실행합니다.
4. Project 패널에서 `GYULAB_LYRIC_VIDEO__1080x1920` 컴포지션을 엽니다.

결과는 1080×1920, 30fps입니다. WAV가 180초보다 길면 컴포지션 길이도 자동으로 늘어납니다.

### 모바일 레이아웃

```text
00_CONTROL
01_TITLE / 02_ARTIST
03_MAIN_MEDIA
04_SECTION
05_LYRIC_01 ... 09_LYRIC_05
10_BRANDING
11_BACKGROUND_MEDIA (source reference)
12_BACKGROUND_DARK
13_BACKGROUND_BLUR
```

- 중앙: 선명한 앨범아트
- 전체 배경: 같은 앨범아트를 확대·블러·어둡게 처리
- 가사: 항상 5줄을 표시합니다.
- 활성 가사: 흰색 43px
- 나머지 가사: 회색 40px
- 활성 줄은 위에서 아래로 이동하고, 다섯 번째 줄 뒤에만 새 5줄 묶음으로 바뀝니다.
- `GYULAB MUSIC` 브랜딩 위치는 Y=1754입니다.

`00_CONTROL`에서 중앙 미디어 크기/위치, 가사 위치, 줄 간격, 배경 어둡기/블러, 비활성 가사 투명도를 조절할 수 있습니다.

## PC / YouTube 가로 템플릿 실행

1. 새 After Effects 프로젝트를 엽니다.
2. **File > Scripts > Run Script File…** 을 선택합니다.
3. `GyuLab_Lyric_Video_PC_Template.jsx`를 실행합니다.
4. Project 패널에서 `GYULAB_DESKTOP_LYRIC__1920x1080`을 엽니다.

결과는 1920×1080, 30fps입니다. 왼쪽에는 840×840 둥근 모서리 앨범아트, 오른쪽에는 제목·아티스트·5줄 롤링 가사가 배치됩니다.

## 다른 곡으로 교체하기

가장 쉬운 방법은 새 곡 파일 이름을 기본 이름으로 바꾸고 바탕화면에 두는 것입니다.

다른 파일명을 유지하려면 JSX 맨 위의 세 줄만 수정합니다.

모바일 JSX:

```javascript
var SUPPLIED_AUDIO = DESKTOP_PATH + "/새 곡.wav";
var SUPPLIED_ARTWORK = DESKTOP_PATH + "/새 앨범아트.png";
var SUPPLIED_SUBTITLES = DESKTOP_PATH + "/새 곡_sync.smi";
```

PC JSX도 같은 방식으로 `AUDIO_PATH`, `ARTWORK_PATH`, `SMI_PATH`를 수정합니다. 파일명만 바꾸고 나서 JSX를 새 프로젝트에서 다시 실행하면 됩니다.

### 제목과 아티스트 변경

각 JSX에서 `01_TITLE`을 만드는 부분의 문구를 바꾸거나, 생성 후 After Effects 타임라인에서 `01_TITLE`, `02_ARTIST` 레이어를 직접 수정합니다.

### 앨범아트만 교체

생성 후 Project 패널에서 아래 pre-comp를 엽니다.

- 모바일: `MAIN_MEDIA__REPLACE_SOURCE_HERE`
- PC: `PC_MAIN_MEDIA__REPLACE_SOURCE_HERE`

새 이미지/영상을 가져온 뒤 `REPLACE_WITH_IMAGE_OR_VIDEO` 레이어 위로 **Alt 키를 누른 채 드래그**하면 교체됩니다.

### SMI 가사 동작

SMI는 한국어 `<SYNC Start=...>` 형식을 읽습니다. 빈 `&nbsp;` 구간은 건너뜁니다. 타임코드마다 현재 줄의 색·크기만 부드럽게 바뀌며, 매 가사마다 전체 5줄이 사라지지 않습니다.

## 길이와 렌더링

기본 길이는 180초입니다. 수동으로 바꾸려면 마스터 컴포지션을 선택하고 **Composition > Composition Settings…** (`Ctrl+K`)에서 Duration을 바꿉니다. Main Media pre-comp도 같은 길이로 맞춥니다.

렌더링은 **Composition > Add to Adobe Media Encoder Queue**를 권장합니다.

- 모바일: H.264, 1080×1920, 30fps, AAC
- PC: H.264, 1920×1080, 30fps, AAC

## 문제 해결

| 증상 | 해결 |
| --- | --- |
| 글꼴이 굴림으로 보임 | 나눔고딕 설치 후 After Effects를 완전히 재시작하고 JSX를 다시 실행합니다. |
| `NULL font instance` 오류 | 최신 JSX를 사용하세요. 폰트를 강제로 지정하지 않고 AE가 확인한 폰트만 적용하도록 처리되어 있습니다. |
| 음악/가사/앨범아트가 비어 있음 | 바탕화면 파일명과 JSX 상단의 파일명을 확인합니다. |
| 가사가 안 나옴 | SMI가 UTF-8이고 `<SYNC Start=...><P ...>` 형식인지 확인합니다. |
| 기존 프로젝트에 잘못 생성됨 | 새 프로젝트를 열어 JSX를 다시 실행합니다. |
