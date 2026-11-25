<img src="https://user-images.githubusercontent.com/12534576/192582340-4c9e4401-1fe6-4dbb-95bb-fdbba5493f61.png"/>

![GitHub](https://img.shields.io/github/license/heartexlabs/label-studio?logo=heartex) ![label-studio:build](https://github.com/HumanSignal/label-studio/workflows/label-studio:build/badge.svg) ![GitHub release](https://img.shields.io/github/v/release/heartexlabs/label-studio?include_prereleases)

[Website](https://labelstud.io/) • [Docs](https://labelstud.io/guide/) • [Join Slack Community <img src="https://app.heartex.ai/docs/images/slack-mini.png" width="18px"/>](https://slack.labelstud.io/?source=github-1)

---

## 白內障手術影片標註教學（中文，一步一步）

這是 `cataract-tool` 分支的使用說明，教你怎麼在 Label Studio 標出手術影片的每個「階段」（phase）。
每一個階段就是時間軸上的一段色塊，例如「第 120 到 860 幀是 Capsulorhexis」。

> **幀（frame）**：影片是一張張圖片連續播放，一張就是一幀。這裡的影片每秒約 30 幀（29.97）。

### 步驟 1：登入

1. 用 Chrome 或 Edge 打開管理員給你的網址。
2. **Email Address** 填你的 email，**Password** 填管理員給你的密碼。
3. 按 **Log in**。

> 影片是 HEVC（H.265）格式時，Firefox 可能播不出來，請用 Chrome 或 Edge。

### 步驟 2：打開要標的影片

1. 進入專案 **Cataract Phase Annotation**。
2. 有兩種開法：
   - 按上方的 **Label All Tasks**：系統會自動一部接一部給你。
   - 或在列表裡**直接點某一列**：打開那一部。
3. 等影片載入。影片很大時，第一次開可能要等幾秒。

### 步驟 3：認識畫面

| 位置 | 是什麼 |
|---|---|
| 上方 | 影片畫面 |
| 影片下方 | 播放控制列：播放／暫停、上一幀／下一幀、目前幀數 |
| 最下方 | **時間軸**：標好的階段會變成一段段色塊 |
| 時間軸旁 | 13 個階段標籤（Incision、Capsulorhexis…），每個有自己的顏色 |
| 右側 | 選到某一段色塊時，這裡會顯示它的開始幀、結束幀 |

### 步驟 4：看影片、找到階段的開頭

- **播放／暫停**：按播放鍵，或用快捷鍵（見下方「快捷鍵總表」）。
- **一幀一幀移動**：Windows `Alt + ←` / `Alt + →`；Mac `Option + ←` / `Option + →`。
- **跳到某個時間**：直接點時間軸上方的刻度列。
- **滑鼠停在刻度列上**：會顯示那個位置是第幾幀、幾分幾秒。

### 步驟 5：標出一個階段（最重要）

1. **先點一個標籤**，例如 `Capsulorhexis`。被選到的標籤會亮起來。
   - 沒先選標籤，在時間軸上拖是畫不出東西的。
2. 在**時間軸上按住滑鼠左鍵，從階段開始的地方拖到結束的地方**，放開。
3. 時間軸上會出現一段該顏色的色塊，這一段就標好了。
4. 換下一個階段：**再點另一個標籤**，重複第 2 步。

### 步驟 6：修改標好的段落

- **拖曳調整**：滑鼠移到色塊的**左邊緣或右邊緣**，游標變成 ↔ 時，按住拖動。
- **輸入精確幀數**：點一下色塊選取它，在右側面板改 **Start frame**（開始幀）、**End frame**（結束幀）。
- **刪除**：點一下色塊選取它，按 Windows `Backspace`／Mac `Delete`。
- **復原／重做**：Windows `Ctrl + Z` / `Ctrl + Shift + Z`；Mac `Cmd + Z` / `Cmd + Shift + Z`。
- **取消選取**：按 `Esc`。

### 步驟 7：放大時間軸（本分支新增）

影片很長時，色塊會很窄、不好拖。時間軸右上角有縮放按鈕：

| 按鈕 | 作用 |
|---|---|
| `−` / `+` | 縮小／放大 |
| `Fit` | 整部影片剛好塞滿時間軸 |
| `1:1` | 回到預設大小 |

旁邊會顯示目前比例（例如「4 px/frame」= 一幀佔 4 個像素）。要精細調整邊界時，先放大再拖。

### 步驟 8：單軌模式（本分支新增，專案有開啟時才會出現）

單軌模式代表**同一個時間點只能有一個階段**。開啟後，時間軸上方會多一條總覽條：

- 一眼看到整部影片標了哪些段落，**斜線條紋 = 還沒標的空白**。
- 上方數字：`covered`（已標的比例）、`gaps`（空白段數）、`overlaps`（重疊段數）。**變紅色代表有問題**。
- 點總覽條可以直接跳到那個位置，滑鼠停在上面會顯示該幀屬於哪個階段。

畫新的段落時，系統會**自動處理重疊**：

- 新段落蓋到舊段落 → 舊段落被**裁短**。
- 新段落畫在舊段落正中間 → 舊段落被**切成前後兩段**。
- 舊段落整個被蓋住 → 舊段落被**刪除**。
- 相鄰或重疊的**同一個標籤** → 自動**合併**成一段。

### 步驟 9：送出

1. 檢查：整部影片從頭到尾都有標到，沒有空白、沒有重疊。
   - 中間沒有手術動作的時間，請標 `Idle`。
2. 按 **Submit** 按鈕（或 Windows `Ctrl + Enter`／Mac `Cmd + Enter`）。
3. 之後要再改：打開同一部，改完按 **Update**。

> 還沒按 Submit 前，系統會自動存草稿，關掉網頁不會整個不見。但**一定要按 Submit 才算完成**。

### 13 個階段

中文名稱僅供參考，正式定義請以研究團隊的標註規範為準。

| 標籤 | 中文 |
|---|---|
| Incision | 切口 |
| Viscoelastic | 注入黏彈劑 |
| Capsulorhexis | 撕囊（連續環形撕囊） |
| Hydrodissection | 水分離 |
| Phacoemulsification | 超音波晶體乳化 |
| Irrigation-Aspiration | 灌注抽吸（清除皮質） |
| Capsule Polishing | 後囊拋光 |
| Lens Implantation | 植入人工水晶體 |
| Lens Positioning | 調整人工水晶體位置 |
| Viscoelastic-Suction | 吸除黏彈劑 |
| Anterior-Chamber Flushing | 前房沖洗 |
| Tonifying-Antibiotics | 傷口加壓密合／注射抗生素 |
| Idle | 無手術動作（器械進出、等待） |

### 常見問題

| 狀況 | 怎麼辦 |
|---|---|
| 影片黑畫面、只有聲音 | 換 Chrome 或 Edge；還是不行就回報管理員是哪一部 |
| 影片轉圈圈很久 | 網路較慢，稍等；一直不行就回報管理員 |
| 在時間軸上拖不出色塊 | 先點一個標籤再拖 |
| 色塊太窄抓不到邊緣 | 用步驟 7 放大時間軸，或在右側面板直接輸入幀數 |
| 不小心刪錯 | Windows `Ctrl + Z`／Mac `Cmd + Z` |

### 快捷鍵總表

| 動作 | Windows | Mac |
|---|---|---|
| 播放／暫停 | `Ctrl + Alt + 空白鍵` | `Cmd + Option + 空白鍵` |
| 上一幀 | `Alt + ←` | `Option + ←` |
| 下一幀 | `Alt + →` | `Option + →` |
| 刪除選取的段落 | `Backspace` | `Delete`（⌫） |
| 取消選取 | `Esc` | `Esc` |
| 復原 | `Ctrl + Z` | `Cmd + Z` |
| 重做 | `Ctrl + Shift + Z` | `Cmd + Shift + Z` |
| 送出（Submit／Update） | `Ctrl + Enter` | `Cmd + Enter` |

> Mac 的 `Cmd` 是 ⌘，`Option` 是 ⌥（有些鍵盤印 `Alt`）。
>
> Mac 上 `Cmd + Option + 空白鍵` 可能會被系統搶走，變成打開 Finder 搜尋視窗。遇到這種情況，請直接點影片下方的播放鍵。

---


## What is Label Studio?

<!-- <a href="https://labelstud.io/blog/release-130.html"><img src="https://github.com/HumanSignal/label-studio/raw/master/docs/themes/htx/source/images/release-130/LS-Hits-v1.3.png" align="right" /></a> -->

Label Studio is an open source data labeling tool. It lets you label data types like audio, text, images, videos, and time series with a simple and straightforward UI and export to various model formats. It can be used to prepare raw data or improve existing training data to get more accurate ML models.

- [Try out Label Studio](#try-out-label-studio)
- [What you get from Label Studio](#what-you-get-from-label-studio)
- [Included templates for labeling data in Label Studio](#included-templates-for-labeling-data-in-label-studio)
- [Set up machine learning models with Label Studio](#set-up-machine-learning-models-with-Label-Studio)
- [Integrate Label Studio with your existing tools](#integrate-label-studio-with-your-existing-tools)

![Gif of Label Studio annotating different types of data](/images/annotation_examples.gif)

Have a custom dataset? You can customize Label Studio to fit your needs. Read an [introductory blog post](https://towardsdatascience.com/introducing-label-studio-a-swiss-army-knife-of-data-labeling-140c1be92881) to learn more. 

## Try out Label Studio

Install Label Studio locally or deploy it in a cloud instance. [Or sign up for a free trial of our Starter Cloud edition!](https://humansignal.com/platform/starter-cloud/) You can learn more about what each edition offers [here](https://labelstud.io/guide/label_studio_compare). 

- [Install locally with Docker](#install-locally-with-docker)
- [Run with Docker Compose (Label Studio + Nginx + PostgreSQL)](#run-with-docker-compose)
- [Install locally with pip](#install-locally-with-pip)
- [Install locally with poetry](#install-locally-with-poetry)
- [Install locally with Anaconda](#install-locally-with-anaconda)
- [Install for local development](#install-for-local-development)
- [Deploy in a cloud instance](#deploy-in-a-cloud-instance)

### Install locally with Docker
Official Label Studio docker image is [here](https://hub.docker.com/r/heartexlabs/label-studio) and it can be downloaded with `docker pull`. 
Run Label Studio in a Docker container and access it at `http://localhost:8080`.


```bash
docker pull heartexlabs/label-studio:latest
docker run -it -p 8080:8080 -v $(pwd)/mydata:/label-studio/data heartexlabs/label-studio:latest
```
You can find all the generated assets, including SQLite3 database storage `label_studio.sqlite3` and uploaded files, in the `./mydata` directory.

#### Override default Docker install
You can override the default launch command by appending the new arguments:
```bash
docker run -it -p 8080:8080 -v $(pwd)/mydata:/label-studio/data heartexlabs/label-studio:latest label-studio --log-level DEBUG
```

#### Build a local image with Docker
If you want to build a local image, run:
```bash
docker build -t heartexlabs/label-studio:latest .
```

### Run with Docker Compose
Docker Compose script provides production-ready stack consisting of the following components:

- Label Studio
- [Nginx](https://www.nginx.com/) - proxy web server used to load various static data, including uploaded audio, images, etc.
- [PostgreSQL](https://www.postgresql.org/) - production-ready database that replaces less performant SQLite3.

To start using the app from `http://localhost` run this command:
```bash
docker-compose up
```

### Run with Docker Compose + MinIO
You can also run it with an additional MinIO server for local S3 storage. This is particularly useful when you want to 
test the behavior with S3 storage on your local system. To start Label Studio in this way, you need to run the following command:
````bash
# Add sudo on Linux if you are not a member of the docker group
docker compose -f docker-compose.yml -f docker-compose.minio.yml up -d
````
If you do not have a static IP address, you must create an entry in your hosts file so that both Label Studio and your 
browser can access the MinIO server. For more detailed instructions, please refer to [our guide on storing data](docs/source/guide/storedata.md).


### Install locally with pip

```bash
# Requires Python >=3.10
pip install label-studio

# Start the server at http://localhost:8080
label-studio
```

### Install locally with poetry

```bash
### install poetry
pip install poetry

### set poetry environment
poetry new my-label-studio
cd my-label-studio
poetry add label-studio

### activate poetry environment
poetry shell

### Start the server at http://localhost:8080
label-studio
```

### Install locally with Anaconda

```bash
conda create --name label-studio
conda activate label-studio
conda install psycopg2
pip install label-studio
```

### Install for local development

You can run the latest Label Studio version locally without installing the package from pypi. 

```bash
# Install all package dependencies
pip install poetry
poetry install
# Run database migrations
python label_studio/manage.py migrate
python label_studio/manage.py collectstatic
# Start the server in development mode at http://localhost:8080
python label_studio/manage.py runserver
```

### Deploy in a cloud instance

You can deploy Label Studio with one click in Heroku, Microsoft Azure, or Google Cloud Platform: 

<a href="https://www.heroku.com/deploy?template=https://github.com/HumanSignal/label-studio/tree/heroku-persistent-pg"><img src="https://www.herokucdn.com/deploy/button.svg" alt="Deploy" height="30px"></a>
[<img src="https://aka.ms/deploytoazurebutton" height="30px">](https://portal.azure.com/#create/Microsoft.Template/uri/https%3A%2F%2Fraw.githubusercontent.com%2Fhumansignal%2Flabel-studio%2Fdevelop%2Fazuredeploy.json)
[<img src="https://deploy.cloud.run/button.svg" height="30px">](https://deploy.cloud.run)


#### Apply frontend changes

For information about updating the frontend, see [label-studio/web/README.md](https://github.com/HumanSignal/label-studio/blob/develop/web/README.md#installation-instructions).


#### Install dependencies on Windows 
To run Label Studio on Windows, download and install the following wheel packages from [Gohlke builds](https://www.lfd.uci.edu/~gohlke/pythonlibs) to ensure you're using the correct version of Python:
- [lxml](https://www.lfd.uci.edu/~gohlke/pythonlibs/#lxml)

```bash
# Upgrade pip 
pip install -U pip

# If you're running Win64 with Python 3.8, install the packages downloaded from Gohlke:
pip install lxml‑4.5.0‑cp38‑cp38‑win_amd64.whl

# Install label studio
pip install label-studio
```

### Run test suite
To add the tests' dependencies to your local install:

```bash
poetry install --with test
```

Alternatively, it is possible to run the unit tests from a Docker container in which the test dependencies are installed:


```bash
make build-testing-image
make docker-testing-shell
```

In either case, to run the unit tests:

```bash
cd label_studio

# sqlite3
DJANGO_DB=sqlite DJANGO_SETTINGS_MODULE=core.settings.label_studio pytest -vv

# postgres (assumes default postgres user,db,pass. Will not work in Docker
# testing container without additional configuration)
DJANGO_DB=default DJANGO_SETTINGS_MODULE=core.settings.label_studio pytest -vv
```
 
## What you get from Label Studio

https://github.com/user-attachments/assets/525ad5ff-6904-4398-b507-7e8954268d69

- **Multi-user labeling** sign up and login, when you create an annotation it's tied to your account.
- **Multiple projects** to work on all your datasets in one instance.
- **Streamlined design** helps you focus on your task, not how to use the software.
- **Configurable label formats** let you customize the visual interface to meet your specific labeling needs.
- **Support for multiple data types** including images, audio, text, HTML, time-series, and video. 
- **Import from files or from cloud storage** in Amazon AWS S3, Google Cloud Storage, or JSON, CSV, TSV, RAR, and ZIP archives. 
- **Integration with machine learning models** so that you can visualize and compare predictions from different models and perform pre-labeling.
- **Embed it in your data pipeline** REST API makes it easy to make it a part of your pipeline

## Included templates for labeling data in Label Studio 

Label Studio includes a variety of templates to help you label your data, or you can create your own using specifically designed configuration language. The most common templates and use cases for labeling include the following cases:

<img src="/images/template-types.png" />

## Set up machine learning models with Label Studio

Connect your favorite machine learning model using the Label Studio Machine Learning SDK. Follow these steps:

1. Start your own machine learning backend server. See [more detailed instructions](https://github.com/HumanSignal/label-studio-ml-backend).
2. Connect Label Studio to the server on the model page found in project settings.

This lets you:

- **Pre-label** your data using model predictions. 
- Do **online learning** and retrain your model while new annotations are being created. 
- Do **active learning** by labeling only the most complex examples in your data.

## Integrate Label Studio with your existing tools

You can use Label Studio as an independent part of your machine learning workflow or integrate the frontend or backend into your existing tools.  

## Ecosystem

| Project | Description |
|-|-|
| label-studio | Server, distributed as a pip package |
| [Frontend library](web/libs/editor/) | The Label Studio frontend library. This uses React to build the UI and mobx-state-tree for state management. |  
| [Data Manager library](web/libs/datamanager/) | A library for the Data Manager, our data exploration tool. | 
| [label-studio-converter](https://github.com/HumanSignal/label-studio-sdk/tree/master/src/label_studio_sdk/converter) | Encode labels in the format of your favorite machine learning library |
| [label-studio-transformers](https://github.com/HumanSignal/label-studio-transformers) | Transformers library connected and configured for use with Label Studio |

## Citation

Include a citation for Label Studio in the **References** section of your articles:

```tex
@misc{Label Studio,
  title={{Label Studio}: Data labeling software},
  url={https://github.com/HumanSignal/label-studio},
  note={Open source software available from https://github.com/HumanSignal/label-studio},
  author={
    Maxim Tkachenko and
    Mikhail Malyuk and
    Andrey Holmanyuk and
    Nikolai Liubimov},
  year={2020-2025},
}
```

## License

This software is licensed under the [Apache 2.0 LICENSE](/LICENSE) © [Heartex](https://www.heartex.com/). 2020-2025

<img src="https://user-images.githubusercontent.com/12534576/192582529-cf628f58-abc5-479b-a0d4-8a3542a4b35e.png" title="Hey everyone!" width="180" />
