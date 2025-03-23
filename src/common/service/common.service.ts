import * as crypto from 'crypto';
import { existsSync, mkdirSync, writeFileSync } from 'fs';
import { path as appRoot } from 'app-root-path';
import { Injectable } from '@nestjs/common';
import { DoplerConfigService } from '@common/config/dopler/config.service';

@Injectable()
export class CommonService {
  constructor(private doplerConfig: DoplerConfigService) {}

  async randString(
    length: number,
    chars: string,
    frontText: string,
  ): Promise<string> {
    let result = `${frontText}`;
    const rand = (char: string) => {
      let result = ``;
      for (let i = char.length + frontText.length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    };
    const afterRand: string = frontText + (await rand(chars));
    for (let i = length - frontText.length; i > 0; --i)
      result += afterRand[Math.floor(Math.random() * afterRand.length)];
    return result;
  }

  normalizePath(path: string): string {
    return path
      .split('/')
      .map((segment) => {
        // Ganti angka atau UUID jadi '*'
        if (/^\d+$/.test(segment)) return '*'; // angka seperti ID
        if (/^[a-f0-9-]{36}$/.test(segment)) return '*'; // UUID
        // Ganti yang mengandung `:` jadi `*`
        if (segment.startsWith(':')) return '*';
        return segment; // kalau bukan parameter, biarkan saja
      })
      .join('/');
  }

  checkFileExtension(base64String): string {
    // Decode base64 to binary
    const binaryData = Buffer.from(base64String, 'base64');

    // Get the first few bytes (file signature)
    const fileSignature = binaryData.slice(0, 4).toString('hex');

    // Map file signatures to file extensions
    const signatureToExtension = {
      '89504e47': 'png',
      '47494638': 'gif',
      ffd8ffe0: 'jpg',
      ffd8ffe1: 'jpg',
      ffd8ffe2: 'jpg',
      ffd8ffe3: 'jpg',
      ffd8ffe8: 'jpg',
      '25504446': 'pdf',
      '504b0304': 'zip',
      '504b030414': 'zip',
      '52617221': 'rar',
      '7f454c46': 'elf',
      '504b0506': 'docx',
      '504b0708': 'xlsx',
      '504b030414000600': 'docx',
      '504b030414000800': 'xlsx',
      '504b030414000808': 'xlsx',
      '504b0304140008080800': 'xlsx',
      '504b030414000808080000': 'xlsx',
      '4d546864': 'mid',
      '1f8b08': 'gz',
      '4f676753': 'ogg',
      '7573746172': 'tar',
      '4d5a': 'exe',
      '377abcaf271c': '7z',
      '4d616e6966657374': 'wav',
      // Add more signatures as needed
    };

    // Check if the file signature is in the map
    const extension = signatureToExtension[fileSignature];

    return extension || 'unknown';
  }

  currencyFormat(number, locale: string, currency: 'IDR' | 'USD') {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(number);
  }

  validUUID(uuid: string) {
    const matchUUid = uuid.match(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    if (!matchUUid) {
      return false;
    }
    return true;
  }

  changePhone(hp: string, convertTo: string): string {
    const phone = hp.replace(/\D/g, '');
    if (phone.length < 6 || phone.length >= 15) {
      return '';
    }

    if (convertTo == '62') {
      if (phone.substring(0, 2) == '62') {
        return phone;
      } else if (phone.substring(0, 2) == '08') {
        return `62${phone.substring(1)}`;
      }
    }

    if (convertTo == '08') {
      if (phone.substring(0, 2) == '08') {
        return phone;
      } else if (phone.substring(0, 2) == '62') {
        return `0${phone.substring(2)}`;
      } else {
        return '';
      }
    }

    return phone;
  }

  async delay(ms: number): Promise<undefined> {
    return new Promise((resolve) => {
      setTimeout(() => {
        return resolve(null);
      }, ms);
    });
  }

  encrypt(text: string, id: string): string {
    const { iv, key } = this._generateKeyAndIVFromID(id);
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encrypted = cipher.update(text, 'utf8', 'base64');
    encrypted += cipher.final('base64');
    return encrypted;
  }

  decrypt(encryptedText, id: string): string {
    const { iv, key } = this._generateKeyAndIVFromID(id);
    const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    let decrypted = decipher.update(encryptedText, 'base64', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  }

  async generateAuthToken(data: Record<string, any>) {
    // const { authSecretKey } = await this.generalParameter();
    const authSecretKey = '';
    if (!data) {
      data = {};
    }
    const dataToSave = JSON.stringify(data);
    const token = this.encrypt(dataToSave, authSecretKey);
    return token;
  }

  async decryptedAuthToken(token: string) {
    // const { authSecretKey } = await this.generalParameter();
    const authSecretKey = '';
    const decryptedToken = this.decrypt(token, authSecretKey);
    let data: Record<string, any>;
    try {
      data = JSON.parse(decryptedToken);
    } catch (error) {
      data = {};
    }
    return data;
  }

  contentType(ext: string) {
    ext = ext?.toLowerCase() || '';
    let contentType: string;
    switch (ext) {
      case 'pdf':
        contentType = 'application/pdf';
        break;
      case 'doc':
      case 'docx':
        contentType = 'application/msword';
        break;
      case 'odt':
        contentType = 'application/vnd.oasis.opendocument.text';
        break;
      case 'rtf':
        contentType = 'application/rtf';
        break;
      case 'txt':
        contentType = 'text/plain';
        break;
      case 'xls':
      case 'xlsx':
        contentType = 'application/vnd.ms-excel';
        break;
      case 'ods':
        contentType = 'application/vnd.oasis.opendocument.spreadsheet';
        break;
      case 'csv':
        contentType = 'text/csv';
        break;
      case 'ppt':
      case 'pptx':
        contentType = 'application/vnd.ms-powerpoint';
        break;
      case 'odp':
        contentType = 'application/vnd.oasis.opendocument.presentation';
        break;
      case 'jpg':
      case 'jpeg':
        contentType = 'image/jpeg';
        break;
      case 'png':
        contentType = 'image/png';
        break;
      case 'gif':
        contentType = 'image/gif';
        break;
      case 'bmp':
        contentType = 'image/bmp';
        break;
      case 'tiff':
      case 'tif':
        contentType = 'image/tiff';
        break;
      case 'svg':
        contentType = 'image/svg+xml';
        break;
      default:
        contentType = 'application/octet-stream';
        break;
    }
    return contentType;
  }

  private _generateKeyAndIVFromID(id: string): { key: any; iv: any } {
    // Use a cryptographic hash function (SHA256 in this case) to create a consistent hash
    const hash = crypto.createHash('sha256').update(id).digest();
    // Slice the hash to get the key and IV of desired lengths
    const key = hash.subarray(0, 32); // 32 bytes for the key
    const iv = hash.subarray(0, 16); // 16 bytes for the IV
    return { key, iv };
  }

  base64ToFile(imageBase64: string, folderPath: string, filename: string) {
    const basePath = `${appRoot}/../public`;
    if (!existsSync(`${basePath}`)) {
      mkdirSync(`${basePath}`, { recursive: true });
    }
    if (!existsSync(`${basePath}${folderPath}`)) {
      mkdirSync(`${basePath}${folderPath}`, { recursive: true });
    }
    const fullPath = `${basePath}${folderPath}/${filename}`;
    writeFileSync(fullPath, imageBase64, 'base64');
    return `${this.doplerConfig.BASE_URL}${folderPath}/${filename}`;
  }

  mimetypeToExt(mimeType: string) {
    const mimeTypeMap = {
      'text/html': ['html', 'htm', 'shtml'],
      'text/css': ['css'],
      'text/xml': ['xml'],
      'image/gif': ['gif'],
      'image/jpeg': ['jpeg', 'jpg'],
      'application/x-javascript': ['js'],
      'application/atom+xml': ['atom'],
      'application/rss+xml': ['rss'],
      'text/mathml': ['mml'],
      'text/plain': ['txt'],
      'text/vnd.sun.j2me.app-descriptor': ['jad'],
      'text/vnd.wap.wml': ['wml'],
      'text/x-component': ['htc'],
      'image/png': ['png'],
      'image/tiff': ['tif', 'tiff'],
      'image/vnd.wap.wbmp': ['wbmp'],
      'image/x-icon': ['ico'],
      'image/x-jng': ['jng'],
      'image/x-ms-bmp': ['bmp'],
      'image/svg+xml': ['svg'],
      'image/webp': ['webp'],
      'application/java-archive': ['jar', 'war', 'ear'],
      'application/mac-binhex40': ['hqx'],
      'application/msword': ['doc'],
      'application/pdf': ['pdf'],
      'application/postscript': ['ps', 'eps', 'ai'],
      'application/rtf': ['rtf'],
      'application/vnd.ms-excel': ['xls'],
      'application/vnd.ms-powerpoint': ['ppt'],
      'application/vnd.wap.wmlc': ['wmlc'],
      'application/vnd.google-earth.kml+xml': ['kml'],
      'application/vnd.google-earth.kmz': ['kmz'],
      'application/x-7z-compressed': ['7z'],
      'application/x-cocoa': ['cco'],
      'application/x-java-archive-diff': ['jardiff'],
      'application/x-java-jnlp-file': ['jnlp'],
      'application/x-makeself': ['run'],
      'application/x-perl': ['pl', 'pm'],
      'application/x-pilot': ['prc', 'pdb'],
      'application/x-rar-compressed': ['rar'],
      'application/x-redhat-package-manager': ['rpm'],
      'application/x-sea': ['sea'],
      'application/x-shockwave-flash': ['swf'],
      'application/x-stuffit': ['sit'],
      'application/x-tcl': ['tcl', 'tk'],
      'application/x-x509-ca-cert': ['der', 'pem', 'crt'],
      'application/x-xpinstall': ['xpi'],
      'application/xhtml+xml': ['xhtml'],
      'application/zip': ['zip'],
      'application/octet-stream': [
        'bin',
        'exe',
        'dll',
        'deb',
        'dmg',
        'eot',
        'iso',
        'img',
        'msi',
        'msp',
        'msm',
      ],
      'audio/midi': ['mid', 'midi', 'kar'],
      'audio/mpeg': ['mp3'],
      'audio/ogg': ['ogg'],
      'audio/x-realaudio': ['ra'],
      'video/3gpp': ['3gpp', '3gp'],
      'video/mpeg': ['mpeg', 'mpg'],
      'video/quicktime': ['mov'],
      'video/x-flv': ['flv'],
      'video/x-mng': ['mng'],
      'video/x-ms-asf': ['asx', 'asf'],
      'video/x-ms-wmv': ['wmv'],
      'video/x-msvideo': ['avi'],
      'video/mp4': ['m4v', 'mp4'],
    };

    return mimeTypeMap?.[mimeType]?.[0] || null;
  }
}
