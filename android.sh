#!/bin/bash

backup_dir="path/to/backup"
project_dir="path/to/your/react-native/project"

replace_files() {
  echo "Replacing files..."
  cp -r "$backup_dir/gradle.properties" "$project_dir/gradle.properties"
  cp -r "$backup_dir/build.properties" "$project_dir/build.properties"
  cp -r "$backup_dir/AndroidManifest.xml" "$project_dir/android/app/src/main/AndroidManifest.xml"
  cp -r "$backup_dir/res" "$project_dir/android/app/src/main/"
  echo "Replacement complete."
}

replace_files
