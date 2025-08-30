git config --global user.name "charan"
git config --global user.email "charan@actions.com"
git switch ${{ github.event.inputs.branch }}
if [ "${{ github.event.inputs.branch }}" == "dev" ]; then
sed -i "s/tag: .*/tag: \"${{ env.IMAGE_TAG }}\"/g" multi-env/values-dev.yaml
elif [ "${{ github.event.inputs.branch }}" == "stage" ]; then
sed -i "s/tag: .*/tag: \"${{ env.IMAGE_TAG }}\"/g" multi-env/values-stage.yaml
else
sed -i "s/tag: .*/tag: \"${{ env.IMAGE_TAG }}\"/g" multi-env/values-prod.yaml
fi

git add .

if git diff --cached --quiet; then
echo "No changes to commit"
else
git commit -m "Updated image tag to ${{ github.event.inputs.image_tag }} in ${{ github.event.inputs.branch }} branch"
git push origin ${{ github.event.inputs.branch }}
fi